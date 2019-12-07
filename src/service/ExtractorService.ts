import {createQueue, Job, Queue} from "kue";
import {Connection, createConnection} from "typeorm";
import {Chain, MigrationType, ServerMode} from "../commons/Constants";
import Block from "../entity/Block";
import Log from "../entity/Log";
import Transaction from "../entity/Transaction";
import logger from "../logger";
import BlockchainEtlProcessor from "./networks/BlockchainEtlProcessor";
import EthereumEtlProcessor from "./networks/ethereum/EthereumEtlProcessor";

/**
 * Extractor Service that pull data (first load with RPC) and listen to new dynamic data through WebSockets
 *
 * This is decoupled from the Chain Network by using queues and abstractions
 *
 * Do not add specific chain code to this Service
 */
export default class ExtractorService {

    /**
     * Add jobs to this queue to persist events on the database, this allows to do multiple requests on the Chain Node
     * and queue request on the database in order to avoid performance problems
     */
    public static DATABASE_QUEUE: Queue = createQueue();

    /**
     * Abstraction for the Chain Network
     */
    private blockchain: BlockchainEtlProcessor;

    private databaseConnection!: Connection;

    constructor(chain: Chain, client: string, network: string, webSocketConnectionString: string,
                rpcConnectionString: string) {
        if (chain === Chain.ETHEREUM) {
            this.blockchain = new EthereumEtlProcessor(chain.toString(), client, network, webSocketConnectionString,
                rpcConnectionString);
        } else {
            throw new Error("Network Not Implemented");
        }

        // process 20 jobs at a time
        // TODO add configuration via secrets/process.env
        ExtractorService.DATABASE_QUEUE.setMaxListeners(40);
    }

    /**
     * Start the extractor service
     */
    public async start() {

        logger.debug("Starting Extractor Service");

        this.databaseConnection = await createConnection();
        await this.databaseConnection.synchronize();

        logger.debug("Database connected");

        const serverMode = process.env.SERVER_MODE;

        if (serverMode === ServerMode.DYNAMIC.toString() ||
            serverMode === ServerMode.BOTH.toString()) {
            // start polling to update new blocks and reorgs
            this.blockchain.connect();
            this.blockchain.poll();
        }
        if (serverMode === ServerMode.LOAD.toString() ||
            serverMode === ServerMode.BOTH.toString()) {
            // start ETL tasks for importing chain old blocks
            // TODO change dynamically from initial load to dynamic importing
            this.blockchain.pullData(this.databaseConnection);
        }

        // start queue processing for all events related to the chain that must be ordered and controlled
        this.blockchain.processQueue();
    }
}
