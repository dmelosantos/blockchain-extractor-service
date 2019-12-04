import {createQueue, Job, Queue} from "kue";
import {Connection, createConnection} from "typeorm";
import {Chain, MigrationType} from "../commons/Constants";
import Block from "../entity/Block";
import logger from "../logger";
import BlockchainNetwork from "../model/networks/BlockchainNetwork";
import EthereumNetwork from "../model/networks/EthereumNetwork";

/**
 * Extractor Service that pull data (first load with RPC) and listen to new dynamic data through WebSockets
 *
 * This is decoupled from the Chain Network by using queues and abstractions
 *
 * Do not add specific chain code to this Service
 */
export default class ExtractorService {

    /**
     * Abstraction for the Chain Network
     */
    private blockchain: BlockchainNetwork;

    /**
     * Add jobs to this queue to persist events on the database, this allows to do multiple requests on the Chain Node
     * and queue request on the database in order to avoid performance problems
     */
    private databaseQueue: Queue = createQueue();

    private databaseConnection!: Connection;

    constructor(chain: Chain, client: string, network: string, webSocketConnectionString: string,
                rpcConnectionString: string) {
        if (chain === Chain.ETHEREUM) {
            this.blockchain = new EthereumNetwork(chain.toString(), client, network, webSocketConnectionString,
                rpcConnectionString, this.databaseQueue);
        } else {
            throw new Error("Network Not Implemented");
        }

        this.databaseQueue.setMaxListeners(20);
    }

    /**
     * Start the extractor service
     */
    public async start() {

        logger.debug("Starting Extractor Service");

        this.databaseConnection = await createConnection();
        await this.databaseConnection.synchronize();

        logger.debug("Database connected");

        this.blockchain.pullData(this.databaseConnection);

        this.processQueue();
    }

    /**
     * Receive information from blockchain network and adds them to the database
     */
    private processQueue(): void {
        this.databaseQueue.process("blocks", 20, async (job: Job, done: () => void) => {

            const fetchedBlock = job.data;
            const block = new Block(`${parseInt(fetchedBlock.number, 16)}`, fetchedBlock.hash, fetchedBlock.parentHash,
                fetchedBlock.nonce, fetchedBlock.sha3Uncles, fetchedBlock.logsBloom, fetchedBlock.transactionsRoot,
                fetchedBlock.stateRoot, fetchedBlock.receiptsRoot, fetchedBlock.miner, fetchedBlock.difficulty,
                fetchedBlock.totalDifficulty, fetchedBlock.size, fetchedBlock.extraData, fetchedBlock.gasLimit,
                fetchedBlock.gasUsed, fetchedBlock.timestamp, fetchedBlock.transactionCount, MigrationType.RPC);

            console.log(block);

            // await this.databaseConnection.manager.save(block);

            done();
        });
    }
}
