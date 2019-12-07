import {Job} from "kue";
import {getConnection} from "typeorm";
import {MigrationType} from "../../../commons/Constants";
import Block from "../../../entity/Block";
import Log from "../../../entity/Log";
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
    }
}
