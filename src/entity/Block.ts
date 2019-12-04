import {Column, Entity, PrimaryColumn} from "typeorm";

/**
 * Class representing blocks in Chain Networks
 */
@Entity()
export default class Block {

    /**
     * The ID represents the block string parsed from hexadecimal
     */
    @PrimaryColumn({
        type: "bigint",
    })
    private id: string;

    @Column({length: 255})
    private hash: string;

    @Column({length: 255})
    private parentHash: string;

    @Column({nullable: true, length: 255})
    private nonce: string;

    @Column()
    private sha3Uncles: string;

    @Column({
        length: 2048,
    })
    private logsBloom: string;

    @Column({length: 255})
    private transactionsRoot: string;

    @Column({length: 255})
    private stateRoot: string;

    @Column({length: 255})
    private receiptsRoot: string;

    @Column({length: 255})
    private miner: string;

    @Column({length: 255})
    private difficulty: string;

    @Column({length: 255})
    private totalDifficulty: string;

    @Column({length: 255})
    private size: string;

    @Column({length: 255})
    private extraData: string;

    @Column({length: 255})
    private gasLimit: string;

    @Column({length: 255})
    private gasUsed: string;

    @Column({length: 255})
    private timestamp: string;

    @Column({nullable: true, length: 255})
    private transactionCount: string;

    constructor(id: string, hash: string, parentHash: string, nonce: string, sha3Uncles: string,
                logsBloom: string, transactionsRoot: string, stateRoot: string,
                receiptsRoot: string, miner: string, difficulty: string, totalDifficulty: string,
                size: string, extraData: string, gasLimit: string, gasUsed: string,
                timestamp: string, transactionCount: string) {
        this.id = id;
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
