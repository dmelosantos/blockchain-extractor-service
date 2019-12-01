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
    },
};

const app = express();
const httpServer = http.createServer(app);
const socketIO = io(httpServer);

const chainString: string = process.env.BLOCKCHAIN;
const client: string = process.env.CLIENT;
const network: string = process.env.NETWORK_TYPE;

const chain = Chain[chainString as keyof typeof Chain];

const extractorService = new ExtractorService(chain, client, network);

app.use(express.static(path.join(__dirname, "public")));

socketIO.on("connection", (socket) => {
    logger.info("a user connected");
    socket.on("disconnect", () => {
        logger.info("user disconnected");
    });
});

httpServer.listen(3000, () => {
    logger.info("listening on *:3000");
});
