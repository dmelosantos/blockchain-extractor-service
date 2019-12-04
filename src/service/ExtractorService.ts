import {createQueue, Job, Queue} from "kue";
import {Chain} from "../commons/Constants";
import logger from "../logger";
import BlockchainNetwork from "../model/networks/BlockchainNetwork";
import EthereumNetwork from "../model/networks/EthereumNetwork";

export default class ExtractorService {
    private blockchain: BlockchainNetwork;

    private databaseQueue: Queue = createQueue();

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

    public start() {
        this.blockchain.pullData();
        this.processQueue();
    }

    private processQueue(): void {
        this.databaseQueue.process("blocks", 20, (job: Job, done: () => void) => {
            logger.debug(job);
        });
    }
}
