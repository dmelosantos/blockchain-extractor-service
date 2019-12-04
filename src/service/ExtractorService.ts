import {createQueue, Job, Queue} from "kue";
import {Connection, ConnectionManager, createConnection, getConnectionManager} from "typeorm";
import {Chain} from "../commons/Constants";
import Block from "../entity/Block";
import logger from "../logger";
import BlockchainNetwork from "../model/networks/BlockchainNetwork";
import EthereumNetwork from "../model/networks/EthereumNetwork";

/**
 * Extractor Service that pull data (first load with RPC) and listen to new dynamic data through WebSockets
 *
 * This is decoupled from the Chain Network by using queues and abstractions
 */
export default class ExtractorService {
    private blockchain: BlockchainNetwork;

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

    public async start() {

        this.databaseConnection = await createConnection();
        await this.databaseConnection.synchronize();

        this.blockchain.pullData();
        this.processQueue();
    }

    private processQueue(): void {
        this.databaseQueue.process("blocks", 20, async (job: Job, done: () => void) => {

            const fetchedBlock = job.data;
            const block = new Block(`${parseInt(fetchedBlock.number, 16)}`, fetchedBlock.hash, fetchedBlock.parentHash,
                fetchedBlock.nonce, fetchedBlock.sha3Uncles, fetchedBlock.logsBloom, fetchedBlock.transactionsRoot,
                fetchedBlock.stateRoot, fetchedBlock.receiptsRoot, fetchedBlock.miner, fetchedBlock.difficulty,
                fetchedBlock.totalDifficulty, fetchedBlock.size, fetchedBlock.extraData, fetchedBlock.gasLimit,
                fetchedBlock.gasUsed, fetchedBlock.timestamp, fetchedBlock.transactionCount);

            await this.databaseConnection.manager.save(block);

            done();
        });
    }
}
