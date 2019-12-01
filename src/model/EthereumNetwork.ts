import BlockchainNetwork from "./BlockchainNetwork";

export default class EthereumNetwork extends BlockchainNetwork {
    constructor(chain: string, client: string, network: string) {
        super(chain, client, network);
    }

    public connect(): void {
    }

    public pullData(): string {
        return "";
    }

    public poll(): string {
        return "";
    }
}
