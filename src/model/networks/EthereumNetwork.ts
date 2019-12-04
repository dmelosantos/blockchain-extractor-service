import {Queue} from "kue";
import * as request from "request-promise-native";
import {Connection} from "typeorm";
import {query} from "winston";
import WebSocket from "ws";
import {MigrationType} from "../../commons/Constants";
import logger from "../../logger";
import BlockchainNetwork from "./BlockchainNetwork";

export default class EthereumNetwork extends BlockchainNetwork {

    private static QUERY_SELECT_FIRST_BLOCK_RPC = `select min(id) as startingBlock from block where migrationType=${MigrationType.RPC.toString()}`;

    /**
     * Static variable representing the timing interval to do request operations on the Nodes to avoid throttling
     */
    private static PULL_DATA_INTERVAL: number = 200;

    private static MAX_RETRIES: number = 10;

    // private socket!: Socket;
    private socket!: WebSocket;

    private latestBlock!: string;
    private databaseQueue: Queue;

    constructor(chain: string, client: string, network: string, webSocketConnectionString: string,
                rpcConnectionString: string, databaseQueue: Queue) {
        super(chain, client, network, webSocketConnectionString, rpcConnectionString);

        this.databaseQueue = databaseQueue;
    }

    /**
     * Connect websocket and other resources here
     */
    public connect(): void {
        // this.socket = socketIo.connect(this.webSocketConnectionString);
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
        const queryResult: any = await databaseConnection.manager.query(EthereumNetwork.QUERY_SELECT_FIRST_BLOCK_RPC);
        let startBlock: string = queryResult.startingBlock;
        if (!startBlock) {
            const responseEarliestBlock = await this.pullBlock("earliest");
            startBlock = responseEarliestBlock ? responseEarliestBlock : "0x0";
        }
        const responseLatestBlock = await this.pullBlock("latest");

        // get the last block
        this.latestBlock = responseLatestBlock ? responseLatestBlock : "0x0";

        this.pullAllBlocks(startBlock);
    }

    /**
     * Method to poll on the Ethereum network with updated information
     * Use this to connect to websockets and get realtime information using WebSockets
     *
     */
    public async poll(): Promise<void> {

        this.socket.on("open", function open() {
            this.send("{\"jsonrpc\":\"2.0\", \"id\": 1, \"method\": \"eth_subscribe\", \"params\": [\"newPendingTransactions\"]}");
        });

        this.socket.on("message", function incoming(data: string) {
            logger.debug(data);
        });
    }

    /**
     * Method responsible for fetching blocks (with intermittent timeout to avoid throttling)
     * @param blockNumber the block number to do rpc call and get all information
     * @param retry variable to control recursive logic of retrying to fetch a block record
     */
    public async pullBlock(blockNumber: string, retry?: number | null): Promise<string | null> {
        logger.debug(`Pulling blocks ${blockNumber}`);

        try {
            const response = await request.post(this.rpcConnectionString, {
                headers: {
                    "Content-Type": "application/json",
                },
                json: {
                    id: "1",
                    jsonrpc: "2.0",
                    method: "eth_getBlockByNumber",
                    params: [blockNumber, true],
                },
            });

            const fetchedBlock = response.result;
            if (fetchedBlock) {
                // pass the data to the extractor service so it can process there
                this.databaseQueue.createJob("blocks", fetchedBlock).save();

                return fetchedBlock.blockNumber;
            }
        } catch (e) {
            logger.error(e);
            if (!retry || retry < EthereumNetwork.MAX_RETRIES) {
                this.pullBlock(blockNumber, retry ? retry + 1 : 0);
            }
        }
        return null;
    }

    /**
     * Pull all blocks by setting timeouts to each call
     * @param currentBlock
     */
    private pullAllBlocks(currentBlock: string) {
        this.pullBlock(currentBlock);

        const nextBlock = `0x${(parseInt(currentBlock, 16) + 1).toString(16)}`;
        // starting adding blockings to the queue
        setTimeout(() => this.pullAllBlocks(nextBlock), EthereumNetwork.PULL_DATA_INTERVAL);
    }

}
