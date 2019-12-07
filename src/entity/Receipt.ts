import {Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Transaction from "./Transaction";

/**
 * Class representing blocks in Chain Networks
 */
@Entity()
export default class Receipt {

    /**
     * The ID represents the log index field
     */
    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    id: string;

    @Column({length: 255})
    @Index()
    transactionHash: string;

    @Column({length: 255})
    transactionIndex: string;

    @Column({length: 255})
    blockHash: string;

    @Column({length: 255})
    blockNumber: string;

    @Column({length: 255})
    cumulativeGasUsed: string;

    @Column({length: 255})
    gasUsed: string;

    @Column({length: 255})
    contractAddress: string;

    @Column({length: 255})
    root: string;

    @Column({length: 255})
    status: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(id: string, transactionHash: string, transactionIndex: string, blockHash: string,
                blockNumber: string, cumulativeGasUsed: string, gasUsed: string, contractAddress: string,
                root: string, status: string, migrationType: MigrationType) {
        this.id = id;
        this.transactionHash = transactionHash;
        this.transactionIndex = transactionIndex;
        this.blockHash = blockHash;
        this.blockNumber = blockNumber;
        this.cumulativeGasUsed = cumulativeGasUsed;
        this.gasUsed = gasUsed;
        this.contractAddress = contractAddress;
        this.root = root;
        this.status = status;
        this.migrationType = migrationType;
    }
}
