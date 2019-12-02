import dotenv from "dotenv";
import express from "express";
import path from "path";

import http from "http";
import io from "socket.io";
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
    },
};

const app = express();
const httpServer = http.createServer(app);

const chainString: string = process.env.BLOCKCHAIN;
const client: string = process.env.CLIENT;
const network: string = process.env.NETWORK_TYPE;
const webSocketConnectionString: string = process.env.WS_CONNECTION_STRING;

const chain = Chain[chainString as keyof typeof Chain];

app.use(express.static(path.join(__dirname, "public")));

httpServer.listen(3000, () => {
    const extractorService = new ExtractorService(chain, client, network, webSocketConnectionString);
    extractorService.start();

    logger.info("listening on *:3000");
});
