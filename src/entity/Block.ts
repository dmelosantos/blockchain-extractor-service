import {Column, Entity, Index, OneToMany, PrimaryColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Transaction from "./Transaction";

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
    id: string;

    @Column({length: 255})
    @Index()
    hash: string;

    @Column({length: 255})
    parentHash: string;

    @Column({nullable: true, length: 255})
    nonce: string;

    @Column({length: 255})
    sha3Uncles: string;

    @Column({length: 4096})
    logsBloom: string;

    @Column({length: 255})
    transactionsRoot: string;

    @Column({length: 255})
    stateRoot: string;

    @Column({length: 255})
    receiptsRoot: string;

    @Column({length: 255})
    miner: string;

    @Column({length: 255})
    difficulty: string;

    @Column({nullable: true, length: 255})
    totalDifficulty: string;

    @Column({length: 255})
    size: string;

    @Column({length: 255})
    extraData: string;

    @Column({length: 255})
    @Index()
    gasLimit: string;

    @Column({length: 255})
    @Index()
    gasUsed: string;

    @Column({length: 255})
    timestamp: string;

    @Column({nullable: true, length: 255})
    @Index()
    transactionCount: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    @OneToMany((type) => Transaction, (transaction) => transaction.block, {cascade: true})
    transactions!: Transaction[];

    constructor(id: string, hash: string, parentHash: string, nonce: string, sha3Uncles: string,
                logsBloom: string, transactionsRoot: string, stateRoot: string,
                receiptsRoot: string, miner: string, difficulty: string, totalDifficulty: string,
                size: string, extraData: string, gasLimit: string, gasUsed: string,
                timestamp: string, transactionCount: string, migrationType: MigrationType) {
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
        this.migrationType = migrationType;
    }
}
