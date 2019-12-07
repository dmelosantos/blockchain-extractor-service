import {ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController, SocketIO} from "socket-controllers";
import logger from "../logger";

/**
 * This is the Socket IO implementation to broadcast messages to the UI in realtime
 */
@SocketController()
export class MessageController {

    @OnConnect()
    connection(@ConnectedSocket() socket: any) {
        logger.info("Dashboard connected");
    }

    @OnDisconnect()
    disconnect(@ConnectedSocket() socket: any) {
        logger.info("Dashboard disconnected");
    }

    @OnMessage("newBlock")
    save(@SocketIO() io: any, @MessageBody() message: any) {
        io.emit("serverChannel", message);
    }
}
