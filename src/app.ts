import express from "express";
import path from "path";

import http from "http";
import io from "socket.io";
import logger from "./logger";

const app = express();
const httpServer = http.createServer(app);
const socketIO = io(httpServer);

// Simulated in-memory cache to store drone"s that registered on the server and send their information
const inMemoryCache = {};

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
