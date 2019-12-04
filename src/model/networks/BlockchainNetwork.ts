/**
 * Abstract class that defines Blockchain Networks
 */
import {Connection} from "typeorm";

export default abstract class BlockchainNetwork {
    protected chain: string;
    protected client: string;
    protected network: string;
    protected webSocketConnectionString: string;
    protected rpcConnectionString: string;

    protected constructor(chain: string, client: string, network: string, webSocketConnectionString: string,
                          rpcConnectionString: string) {
        this.chain = chain;
        this.client = client;
        this.network = network;
        this.webSocketConnectionString = webSocketConnectionString;
        this.rpcConnectionString = rpcConnectionString;
    }

    public abstract connect(): void;
    public abstract async pullData(databaseConnection: Connection): Promise<void>;
    public abstract poll(): void;
}
