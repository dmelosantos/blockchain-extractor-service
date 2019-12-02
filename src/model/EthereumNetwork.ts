// import Socket = SocketIOClient.Socket;
// import * as socketIo from "socket.io-client";
import WebSocket from "ws";
import BlockchainNetwork from "./BlockchainNetwork";

export default class EthereumNetwork extends BlockchainNetwork {

    // private socket!: Socket;
    private socket!: WebSocket;

    constructor(chain: string, client: string, network: string, webSocketConnectionString: string) {
        super(chain, client, network, webSocketConnectionString);
    }

    public connect(): void {
        // this.socket = socketIo.connect(this.webSocketConnectionString);
        this.socket = new WebSocket(this.webSocketConnectionString);
    }

    public pullData(): string {
        return "";
    }

    public async poll(): Promise<void> {

        this.socket.on("open", function open() {
            this.send("{\"jsonrpc\":\"2.0\", \"id\": 1, \"method\": \"eth_subscribe\", \"params\": [\"newPendingTransactions\"]}");
        });

        this.socket.on("message", function incoming(data) {
            console.log(data);
        });

      // this.socket.emit("{\"jsonrpc\":\"2.0\", \"id\": 1,
        // \"method\": \"eth_subscribe\", \"params\": [\"newPendingTransactions\"]}", (answer: string) => {
            // console.log(answer);
        // });

        /* this.socket.on("message", (message: string) => {
            console.log(message);
        });*/
    }
}
