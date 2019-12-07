import {Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Transaction from "./Transaction";

/**
 * Class representing blocks in Chain Networks
 */
@Entity()
export default class TokenTransfer {

    /**
     * The ID represents the log index field
     */
    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    id: string;

    @Column({length: 255})
    @Index()
    tokenAddress: string;

    @Column({length: 255})
    fromAddress: string;

    @Column({length: 255})
    value: string;

    @Column({length: 255})
    transactionHash: string;

    @Column({length: 255})
    blockNumber: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(id: string, tokenAddress: string, fromAddress: string, value: string, transactionHash: string,
                blockNumber: string, migrationType: MigrationType) {
        this.id = id;
        this.tokenAddress = tokenAddress;
        this.fromAddress = fromAddress;
        this.value = value;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.migrationType = migrationType;
    }
}
