import {createLogger, Logger, LoggerOptions, transports} from "winston";

const defaultLevel = process.env.LOG_LEVEL;

const options: LoggerOptions = {
    exitOnError: false,
    level: defaultLevel,
    transports: [
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
    ],
};

const logger: Logger = createLogger(options);

if (process.env.NODE_ENV === "develop") {
    logger.add(new transports.Console({
        level: "debug",
    }));
}

export default logger;
