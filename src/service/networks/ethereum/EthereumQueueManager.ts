import {Job} from "kue";
import io from "socket.io-client";
import {getConnection} from "typeorm";
import ExpressApp from "../../../app";
import {MigrationType} from "../../../commons/Constants";
import Block from "../../../entity/Block";
import Log from "../../../entity/Log";
import Trace from "../../../entity/Trace";
import TraceAction from "../../../entity/TraceAction";
import Transaction from "../../../entity/Transaction";
import logger from "../../../logger";
import ExtractorService from "../../ExtractorService";

export default class EthereumQueueManager {

    public static getInstance(): EthereumQueueManager {
        if (!this.instance) {
            this.instance = new EthereumQueueManager();
        }
        return  this.instance;
    }

    private static instance: EthereumQueueManager;

    private socket: SocketIOClient.Socket = io(ExpressApp.SERVER_SOCKET_URL);

    /**
     * Receive information from blockchain network and adds them to the database
     */
    public processQueue(): void {

        ExtractorService.DATABASE_QUEUE.process("blocks", 20, async (job: Job, done: () => void) => {
            const fetchedBlock = job.data;

            try {
                // REFACTOR the block entity should be generic enough but for now is tightly coupled to ethereum stuff
                const block = new Block(`${parseInt(fetchedBlock.number, 16)}`, fetchedBlock.number,
                    fetchedBlock.hash, fetchedBlock.parentHash,
                    fetchedBlock.nonce, fetchedBlock.sha3Uncles, fetchedBlock.logsBloom, fetchedBlock.transactionsRoot,
                    fetchedBlock.stateRoot, fetchedBlock.receiptsRoot, fetchedBlock.miner, fetchedBlock.difficulty,
                    fetchedBlock.totalDifficulty, fetchedBlock.size, fetchedBlock.extraData, fetchedBlock.gasLimit,
                    fetchedBlock.gasUsed, fetchedBlock.timestamp, fetchedBlock.transactionCount,
                    fetchedBlock.migrationType);

                if (fetchedBlock.transactions && fetchedBlock.transactions.length > 0) {
                    block.transactions = [];

                    fetchedBlock.transactions.forEach((transactionData: any) => {
                        const transaction = new Transaction(transactionData.hash, transactionData.nonce,
                            transactionData.blockHash, block,
                            transactionData.transactionIndex, transactionData.from, transactionData.to,
                            transactionData.value,
                            transactionData.gasPrice, transactionData.gas, transactionData.input,
                            transactionData.v, transactionData.standardV, transactionData.r,
                            transactionData.raw, transactionData.publicKey, transactionData.chainId,
                            transactionData.creates, transactionData.condition, fetchedBlock.migrationType);
                        block.transactions.push(transaction);
                    });
                }
                if (fetchedBlock.migrationType === MigrationType.WS) {
                    this.socket.emit("newBlock", fetchedBlock);
                }

                await getConnection().manager.save(block);
            } catch (e) {
                // TODO add to dead letter queue
                logger.error(e.toString(), e);
                logger.error("Failed block");
                logger.error(fetchedBlock);
            }

            done();
        });

        ExtractorService.DATABASE_QUEUE.process("logs", 20, async (job: Job, done: () => void) => {
            const fetchedLogs = job.data;

            try {
                const logs: any[] = [];
                fetchedLogs.forEach((fetchedLog: any) => {
                    const log = new Log(`${parseInt(fetchedLog.logIndex, 16)}`, fetchedLog.logIndex,
                        fetchedLog.transactionHash, fetchedLog.transactionIndex, fetchedLog.blockHash,
                        fetchedLog.blockNumber, fetchedLog.address, fetchedLog.data, fetchedLog.topics.join(),
                        MigrationType.RPC);
                    logs.push(log);
                });
                await getConnection().manager.save(logs);
            } catch (e) {
                // TODO add to dead letter queue
                logger.error(e.toString(), e);
                logger.error("Failed Log");
                logger.error(fetchedLogs);
            }

            done();
        });

        ExtractorService.DATABASE_QUEUE.process("traceTransactions", 20, async (job: Job, done: () => void) => {
            const fetchedTraces = job.data;

            try {
                const traces: any[] = [];
                fetchedTraces.forEach((fetchedTrace: any) => {
                    const traceAction = new TraceAction(fetchedTrace.action.callType, fetchedTrace.action.from,
                        fetchedTrace.action.gas, fetchedTrace.action.input, fetchedTrace.action.to,
                        fetchedTrace.action.value);
                    const trace = new Trace(traceAction, fetchedTrace.blockHash, fetchedTrace.blockNumber,
                                            fetchedTrace.result.gasUsed, fetchedTrace.result.output,
                                            fetchedTrace.subtraces, fetchedTrace.traceAddress.join(),
                                            fetchedTrace.transactionHash, fetchedTrace.transactionPosition,
                                            fetchedTrace.type, MigrationType.RPC);
                });
                await getConnection().manager.save(traces);
            } catch (e) {
                // TODO add to dead letter queue
                logger.error(e.toString(), e);
                logger.error("Failed Trace");
                logger.error(fetchedTraces);
            }

            done();
        });
    }
}
