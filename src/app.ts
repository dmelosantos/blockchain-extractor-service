import dotenv from "dotenv";
import express from "express";
import path from "path";

import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import {createSocketServer} from "socket-controllers";
import {EthereumController} from "./api/EthereumController";
import {MessageController} from "./api/MessageController";
import {Chain} from "./commons/Constants";
import logger from "./logger";
import ExtractorService from "./service/ExtractorService";

dotenv.config();

declare var process: {
    env: {
        BLOCKCHAIN: string,
        CLIENT: string,
        NETWORK_TYPE: string,
        WS_CONNECTION_STRING: string,
        RPC_CONNECTION_STRING: string,
        SERVER_MODE: string,
        SERVER_PORT: number,
        SERVER_SOCKET_PORT: number,
        SERVER_SOCKET_URL: string,
    },
};

// we can use process.env direct on the code, but I wanted to decouple the module from that
// so I decided to initialize then on the startup of express app
const chainString: string = process.env.BLOCKCHAIN;
const client: string = process.env.CLIENT;
const network: string = process.env.NETWORK_TYPE;
const webSocketConnectionString: string = process.env.WS_CONNECTION_STRING;
const rpcConnectionString: string = process.env.RPC_CONNECTION_STRING;
const chain = Chain[chainString as keyof typeof Chain];

export default class ExpressApp {

    public static SERVER_SOCKET_URL = process.env.SERVER_SOCKET_URL;

    public start(): void {
        this.configureExpress();
    }

    private configureExpress(): void {
        const app = createExpressServer({
            controllers: [EthereumController],
            cors: true,
        });

        createSocketServer(process.env.SERVER_SOCKET_PORT, {
            controllers: [MessageController],
        });

        // serve built vue app from here
        app.use(express.static(path.join(__dirname, "public")));

        app.listen(process.env.SERVER_PORT, () => {
            const extractorService = new ExtractorService(chain, client, network, webSocketConnectionString,
                rpcConnectionString);

            extractorService.start();

            logger.info(`listening on *:${process.env.SERVER_PORT}`);
        });
    }
}

const expressApp = new ExpressApp();
expressApp.start();
