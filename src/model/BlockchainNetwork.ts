/**
 * Abstract class that defines Blockchain Networks
 */
export default abstract class BlockchainNetwork {
    protected chain: string;
    protected client: string;
    protected network: string;

    constructor(chain: string, client: string, network: string) {
        this.chain = chain;
        this.client = client;
        this.network = network;
    }

    public abstract connect(): void;
    public abstract pullData(): string;
    public abstract poll(): string;
}
