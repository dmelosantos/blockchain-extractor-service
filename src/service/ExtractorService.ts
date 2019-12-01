import {Chain} from "../commons/constants";
import BlockchainNetwork from "../model/BlockchainNetwork";
import EthereumNetwork from "../model/EthereumNetwork";

export default class ExtractorService {
    private blockchain: BlockchainNetwork;
    constructor(chain: Chain, client: string, network: string) {
        if (chain === Chain.ETHEREUM) {
            this.blockchain = new EthereumNetwork(chain.toString(), client, network);
        } else {
            throw new Error("Network Not Implemented");
        }
    }
}
