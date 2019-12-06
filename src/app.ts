import dotenv from "dotenv";
import express from "express";
import path from "path";

import http from "http";
import { createQueue } from "kue";
import "reflect-metadata";
import io from "socket.io";
import {createConnection} from "typeorm";
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

class ExpressApp {

    public start(): void {
        this.configureExpress();
    }

    private configureExpress(): void {
        const app = express();
        const httpServer = http.createServer(app);

        // serve built vue app from here
        app.use(express.static(path.join(__dirname, "public")));

        httpServer.listen(3000, () => {
            const extractorService = new ExtractorService(chain, client, network, webSocketConnectionString,
                rpcConnectionString);

            extractorService.start();

            logger.info("listening on *:3000");
        });
    }
}

const expressApp = new ExpressApp();
expressApp.start();
