import {Chain} from "../commons/Constants";
import BlockchainNetwork from "../model/networks/BlockchainNetwork";
import EthereumNetwork from "../model/networks/EthereumNetwork";

export default class ExtractorService {
    private blockchain: BlockchainNetwork;
    constructor(chain: Chain, client: string, network: string, webSocketConnectionString: string,
                rpcConnectionString: string) {
        if (chain === Chain.ETHEREUM) {
            this.blockchain = new EthereumNetwork(chain.toString(), client, network, webSocketConnectionString,
                rpcConnectionString);
        } else {
            throw new Error("Network Not Implemented");
        }
    }

    public start() {
        // this.blockchain.connect();
        // this.blockchain.poll();
        this.blockchain.pullData();
    }
}
