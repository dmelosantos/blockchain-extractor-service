/**
 * Abstract class that defines Blockchain Networks
 */
export default abstract class BlockchainNetwork {
    protected chain: string;
    protected client: string;
    protected network: string;
    protected webSocketConnectionString: string;

    constructor(chain: string, client: string, network: string, webSocketConnectionString: string) {
        this.chain = chain;
        this.client = client;
        this.network = network;
        this.webSocketConnectionString = webSocketConnectionString;
    }

    public abstract connect(): void;
    public abstract pullData(): string;
    public abstract poll(): void;
}
