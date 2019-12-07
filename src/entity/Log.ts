import {Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Transaction from "./Transaction";

/**
 * Class representing logs in Ethereum Networks
 */
@Entity()
export default class Log {

    /**
     * The ID represents the log index field
     */
    @PrimaryColumn({
        type: "bigint",
    })
    id!: string;

    @Column({length: 255})
    @Index()
    logIndex: string;

    @Column({length: 255})
    @Index()
    transactionHash: string;

    @Column({length: 255})
    transactionIndex: string;

    @Column({nullable: true, length: 255})
    @Index()
    blockHash: string;

    @Column({length: 255})
    @Index()
    blockNumber: string;

    @Column({length: 255})
    @Index()
    address: string;

    @Column({type: "text"})
    data: string;

    @Column({type: "text"})
    topics: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(id: string, logIndex: string, transactionHash: string, transactionIndex: string, blockHash: string,
                blockNumber: string, address: string, data: string, topics: string, migrationType: MigrationType) {
        this.id = id;
        this.logIndex = logIndex;
        this.transactionHash = transactionHash;
        this.transactionIndex = transactionIndex;
        this.blockHash = blockHash;
        this.blockNumber = blockNumber;
        this.address = address;
        this.data = data;
        this.topics = topics;
        this.migrationType = migrationType;
    }
}
