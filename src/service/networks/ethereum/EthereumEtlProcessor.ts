import {Connection} from "typeorm";
import WebSocket from "ws";
import {MigrationType} from "../../../commons/Constants";
import {delay, makeRpcCall} from "../../../commons/Utils";
import logger from "../../../logger";
import ExtractorService from "../../ExtractorService";
import BlockchainEtlProcessor from "../BlockchainEtlProcessor";
import EthereumQueueManager from "./EthereumQueueManager";

/**
 * Ethereum ETL Processor adds the logic to pull information from ethereum networks.
 * Currently implemented: Blocks, Transactions, Logs, Traces
 * TODO: Tokens, Token Transfers, Contracts and Receipts extraction
 */
export default class EthereumEtlProcessor extends BlockchainEtlProcessor {

    private static QUERY_SELECT_FIRST_BLOCK_RPC = `select max(id) as startingBlock from block where migrationType='${MigrationType.RPC}'`;

    /**
     * Static variable representing the timing interval to do request operations on the Nodes to avoid throttling
     */
    private static PULL_DATA_INTERVAL: number = 500;

    private static MAX_RETRIES: number = 10;

    private static newHeadsSubscriptionId: string | null = null;

    private static NEW_HEADS_SUBSCRIPTION_JSON_RPC_PAYLOAD: any = {
        id: 1, jsonrpc: "2.0", method: "eth_subscribe", params: ["newHeads"],
    };

    private socket!: WebSocket;

    private latestBlock!: string;

    private queueManager: EthereumQueueManager = EthereumQueueManager.getInstance();

    constructor(chain: string, client: string, network: string, webSocketConnectionString: string,
                rpcConnectionString: string) {
        super(chain, client, network, webSocketConnectionString, rpcConnectionString);
    }

    /**
     * Connect websocket and other resources here
     */
    public connect(): void {
        logger.debug("Connecting websocket");

        this.socket = new WebSocket(this.webSocketConnectionString);

    }

    /**
     * Method to do extraction from the selected Ethereum Network
     * This does the initial pull of the earliest to the latest block
     * The polling method is responsible for updating new information only
     *
     * Resolves: Create a Typescript server/job/script to pull data from an Ethereum client (ie. Parity)
     * and push it to a Mysql instance.\
     *
     */
    public async pullData(databaseConnection: Connection): Promise<void> {
        // fetch first block from the database if exists otherwise from the network
        const queryResult: any = await databaseConnection.manager.query(
            EthereumEtlProcessor.QUERY_SELECT_FIRST_BLOCK_RPC);
        // if it finds on the query convert the block id from integer to hexadecimal, otherwise null
        // let startBlock: string | null = queryResult.length > 0 && queryResult[0].startingBlock ?
        //    `0x${(parseInt(queryResult[0].startingBlock, 16) + 1).toString(16)}` : null;
        let startBlock = "0xE6361B";
        // if it doesn't find, let's get the information from the Node by fetching the earliest block
        if (!startBlock) {
            const responseEarliestBlock = await this.pullBlock("earliest", null, false);
            startBlock = responseEarliestBlock ? responseEarliestBlock : "0x0";
        }
        // control the ETL running, by stopping with the last block at the moment the migration started
        const responseLatestBlock = await this.pullBlock("latest", null, false);
        this.latestBlock = responseLatestBlock ? responseLatestBlock : "0x0";

        logger.debug(`Starting migration from block:${startBlock}`);
        logger.debug(`Latest block: ${this.latestBlock}`);

        // start the pulling of blocks with timed intervals to avoid throttling
        this.pullAll(startBlock);
    }

    /**
     * Method to poll on the Ethereum network with updated information
     *
     * Use this to connect to websockets and get realtime information using WebSockets
     * To keep the database up-to-date after an initial export-load this polling is running that detects new blocks
     * and inserts on them on the database queue.
     *
     * From Parity Gitter:
     * Every reorg will emit a bunch of newheads events for all the new blocks you see,
     * it doesn't matter if you subscribe after the common block, because the subscription only shows you
     * what parity is already keeping track of.
     * The subscription is just "tell me about all the block headers you import as canonical"
     *
     * Following the stated above and since typeorm does upsert we can receive the new block even
     * after it has already been inserted on the database
     * and it will be update last (the queue guarantees this), thus reorgs logic working
     */
    public async poll(): Promise<void> {

        this.socket.on("open", function open() {
            this.send(JSON.stringify(EthereumEtlProcessor.NEW_HEADS_SUBSCRIPTION_JSON_RPC_PAYLOAD));
        });

        this.socket.on("message", function incoming(data: string) {
            const websocketResponse = JSON.parse(data);
            // replying the first time with subscription ID
            if (typeof websocketResponse.result === "string") {
                EthereumEtlProcessor.newHeadsSubscriptionId = websocketResponse.result;

                logger.debug(`newsHead subscription id ${websocketResponse.result}`);
            } else {
                const fetchedBlock = websocketResponse.params.result;

                logger.debug(`Storing new head block ${fetchedBlock.number}`);

                fetchedBlock.migrationType = MigrationType.WS;
                // pass the data to the extractor service so it can process there
                ExtractorService.DATABASE_QUEUE.createJob("blocks", fetchedBlock).save();
            }
        });
    }

    /**
     * Method responsible for fetching blocks (with intermittent timeout to avoid throttling)
     * @param blockNumber the block number to do rpc call and get all information
     * @param retry variable to control recursive logic of retrying to fetch a block record
     * @param insert flag to define if this pull operation should add the block on the database or not
     */
    public async pullBlock(blockNumber: string, retry?: number | null, insert = true): Promise<string | null> {
        logger.debug(`Pulling blocks ${blockNumber}`);

        try {
            const rpcResponse = await makeRpcCall(this.rpcConnectionString,
                "eth_getBlockByNumber", [blockNumber, true]);

            const fetchedBlock = rpcResponse.result;
            if (fetchedBlock) {
                // set the migration type to RPC to differentiate between new blocks imported on polling or via RPC
                fetchedBlock.migrationType = MigrationType.RPC;

                // pass the data to the extractor service so it can process there
                if (insert) {
                    ExtractorService.DATABASE_QUEUE.createJob("blocks", fetchedBlock).save();
                    /**
                     * TODO add logic to only enable this if the Node support it
                     * pull transaction traces here, since we set the flag on the rpc call to fetch all the transactions
                     * along with the block
                     * we only need to fetch traces when the insert on database is true
                     * save traces on a different queue
                     *  if (fetchedBlock.transactions && fetchedBlock.transactions.length > 0) {
                     *     for (const transactionData of fetchedBlock.transactions) {
                     *        await this.pullTraceTransaction(transactionData.hash);
                     *     }
                     *  }
                     */
                }

                return fetchedBlock.number;
            }
        } catch (e) {
            logger.error(e.toString(), e);
            if (!retry || retry < EthereumEtlProcessor.MAX_RETRIES) {
                return this.pullBlock(blockNumber, retry ? retry + 1 : 0, insert);
            }
        }
        return null;
    }

    /**
     * Get trace information for transactions
     *
     * @param transactionHash
     * @param retry
     * @param insert
     */
    public async pullTraceTransaction(transactionHash: string, retry?: number | null,
                                      insert = true): Promise<string | null> {
        logger.debug(`Pulling trace transactions ${transactionHash}`);

        try {
            const rpcResponse = await makeRpcCall(this.rpcConnectionString,
                "trace_transaction", [transactionHash]);

            const fetchedTrace = rpcResponse.result;
            if (fetchedTrace) {
                // set the migration type to RPC to differentiate between new blocks imported on polling or via RPC
                fetchedTrace.migrationType = MigrationType.RPC;

                // pass the data to the extractor service so it can process there
                if (insert) {
                    ExtractorService.DATABASE_QUEUE.createJob("traceTransactions", fetchedTrace).save();
                }

                return fetchedTrace;
            }
        } catch (e) {
            logger.error(e.toString(), e);
            if (!retry || retry < EthereumEtlProcessor.MAX_RETRIES) {
                return this.pullTraceTransaction(transactionHash, retry ? retry + 1 : 0, insert);
            }
        }
        return null;
    }

    /**
     * Method responsible to pull logs from blocks on the chain
     *
     * @param blockNumber which block number should be fetched (in hexadecimal)
     * @param retry set the retry to a index 0 to MAX_RETRIES
     * @param insert flag if this record should go to the database or not
     */
    public async pullLog(blockNumber: string, retry?: number | null, insert = true): Promise<string | null> {
        logger.debug(`Pulling logs for ${blockNumber}`);

        try {
            const rpcResponse = await makeRpcCall(this.rpcConnectionString,
                "eth_getLogs", [{ fromBlock: blockNumber, toBlock: blockNumber}]);

            const fetchedLog = rpcResponse.result;
            if (fetchedLog) {
                // set the migration type to RPC to differentiate between new blocks imported on polling or via RPC
                fetchedLog.migrationType = MigrationType.RPC;

                // pass the data to the extractor service so it can process there
                if (insert) {
                    ExtractorService.DATABASE_QUEUE.createJob("logs", fetchedLog).save();
                }

                return fetchedLog.number;
            }
        } catch (e) {
            logger.error(e.toString(), e);
            if (!retry || retry < EthereumEtlProcessor.MAX_RETRIES) {
                return this.pullLog(blockNumber, retry ? retry + 1 : 0, insert);
            }
        }
        return null;
    }

    /**
     * Process queues for tasks related to processing and streaming tasks
     */
    public processQueue(): void {
        this.queueManager.processQueue();
    }

    /**
     * Pull all blocks, logs and traces
     *
     * @param currentBlock
     */
    public async pullAll(currentBlock: string) {
        await this.pullBlock(currentBlock);
        await this.pullLog(currentBlock);
        await delay(EthereumEtlProcessor.PULL_DATA_INTERVAL);

        const nextBlock = `0x${(parseInt(currentBlock, 16) + 1).toString(16)}`;

        this.pullAll(nextBlock);
    }
}
