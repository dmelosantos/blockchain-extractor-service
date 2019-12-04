// import Socket = SocketIOClient.Socket;
// import * as socketIo from "socket.io-client";
import * as request from "request-promise-native";
import WebSocket from "ws";
import logger from "../../logger";
import BlockchainNetwork from "./BlockchainNetwork";

export default class EthereumNetwork extends BlockchainNetwork {

    /**
     * Static variable representing the timing interval to do request operations on the Nodes to avoid throttling
     */
    private static PULL_DATA_INTERVAL: number = 2000;

    private static BLOCK_PARTITION: number = 1000000;

    // private socket!: Socket;
    private socket!: WebSocket;

    private latestBlock!: string;
    private currentBlock!: string;

    constructor(chain: string, client: string, network: string, webSocketConnectionString: string,
                rpcConnectionString: string) {
        super(chain, client, network, webSocketConnectionString, rpcConnectionString);
    }

    public connect(): void {
        // this.socket = socketIo.connect(this.webSocketConnectionString);
        this.socket = new WebSocket(this.webSocketConnectionString);
    }

    /**
     * Method to do extraction from the selected Ethereum Network
     * This does the initial pull of the earliest to the latest block
     * The polling method is responsible for updating new information only
     *
     * Resolves: Create a Typescript server/job/script to pull data from an Ethereum client (ie. Parity)
     * and push it to a Mysql instance.\
     *
     */
    public async pullData(): Promise<void> {
        // first get the latest block
        const responseEarliestBlock = await this.pullBlock("earliest");
        const responseLatestBlock = await this.pullBlock("latest");

        this.currentBlock = responseEarliestBlock;
        this.latestBlock = responseLatestBlock;

        // the register to the websocket and start adding from there
        setInterval(() => this.pullBlock(this.currentBlock), EthereumNetwork.PULL_DATA_INTERVAL);
    }

    /**
     * Method to poll on the Ethereum network with updated information
     * Use this to connect to websockets and get realtime information using WebSockets
     *
     */
    public async poll(): Promise<void> {

        this.socket.on("open", function open() {
            this.send("{\"jsonrpc\":\"2.0\", \"id\": 1, \"method\": \"eth_subscribe\", \"params\": [\"newPendingTransactions\"]}");
        });

        this.socket.on("message", function incoming(data: string) {
            logger.debug(data);
        });
    }

    /**
     * Method responsible for fetching blocks (with intermittent timeout to avoid throttling)
     * @param blockNumber the block number to do rpc call and get all information
     */
    public async pullBlock(blockNumber: string): Promise<string> {
        logger.debug(`Pulling blocks ${blockNumber}`);

        // update the block for the next interval to fetch
        this.currentBlock = `0x${(parseInt(blockNumber, 16) + 1).toString(16)}`;

        const response = await request.post(this.rpcConnectionString, {
            headers: {
                "Content-Type": "application/json",
            },
            json: {
                id: "1",
                jsonrpc: "2.0",
                method: "eth_getBlockByNumber",
                params: [blockNumber, false],
            },
        });

        // TODO add to database or buffer to database
        logger.debug(response.result);

        logger.debug("----------------------------");
        return response.result ? response.result.number : null;
    }

    private async pullTransactions(transactions: [string]): Promise<void> {
        logger.debug("Pulling transactions");
    }
}
