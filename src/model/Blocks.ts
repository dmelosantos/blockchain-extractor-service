import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Class representing blocks in Chain Networks
 */
export default class Blocks {
    @PrimaryGeneratedColumn()
    private blockNumber: number;

    @Column()
    private hash: string;

    @Column()
    private parentHash: string;

    @Column()
    private nonce: string;

    @Column()
    private sha3Uncles: string;

    @Column()
    private logsBloom: string;

    @Column()
    private transactionsRoot: string;

    @Column()
    private stateRoot: string;

    @Column()
    private receiptsRoot: string;

    @Column()
    private miner: string;

    @Column()
    private difficulty: number;

    @Column()
    private totalDifficulty: number;

    @Column()
    private size: number;

    @Column()
    private extraData: string;

    @Column()
    private gasLimit: number;

    @Column()
    private gasUsed: number;

    @Column()
    private timestamp: number;

    @Column()
    private transactionCount: number;

    constructor(blockNumber: number, hash: string, parentHash: string, nonce: string, sha3Uncles: string,
                logsBloom: string, transactionsRoot: string, stateRoot: string,
                receiptsRoot: string, miner: string, difficulty: number, totalDifficulty: number,
                size: number, extraData: string, gasLimit: number, gasUsed: number,
                timestamp: number, transactionCount: number) {
        this.blockNumber = blockNumber;
        this.hash = hash;
        this.parentHash = parentHash;
        this.nonce = nonce;
        this.sha3Uncles = sha3Uncles;
        this.logsBloom = logsBloom;
        this.transactionsRoot = transactionsRoot;
        this.stateRoot = stateRoot;
        this.receiptsRoot = receiptsRoot;
        this.miner = miner;
        this.difficulty = difficulty;
        this.totalDifficulty = totalDifficulty;
        this.size = size;
        this.extraData = extraData;
        this.gasLimit = gasLimit;
        this.gasUsed = gasUsed;
        this.timestamp = timestamp;
        this.transactionCount = transactionCount;
    }
}
