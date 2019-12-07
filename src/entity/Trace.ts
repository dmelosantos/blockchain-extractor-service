import {Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Transaction from "./Transaction";

@Entity()
export default class Trace {

    /**
     * The ID represents the block string parsed from hexadecimal
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

    @Column({nullable: true, length: 255})
    fromAddress: string;

    @Column({length: 255})
    toAddress: string;

    @Column({length: 4096})
    value: string;

    @Column({length: 4096})
    input: string;

    @Column({length: 4096})
    output: string;

    @Column({length: 255})
    traceType: string;

    @Column({length: 255})
    callType: string;

    @Column({length: 255})
    rewardType: string;

    @Column({length: 255})
    gas: string;

    @Column({length: 255})
    gasUsed: string;

    @Column({length: 255})
    subtraces: string;

    @Column({length: 255})
    @Index()
    traceAddress: string;

    @Column({type: "text"})
    error: string;

    @Column({length: 255})
    status: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(id: string, transactionHash: string, transactionIndex: string, fromAddress: string, toAddress: string,
                value: string, input: string, output: string, traceType: string, callType: string, rewardType: string,
                gas: string, gasUsed: string, subtraces: string, traceAddress: string, error: string, status: string,
                migrationType: MigrationType) {
        this.id = id;
        this.transactionHash = transactionHash;
        this.transactionIndex = transactionIndex;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.value = value;
        this.input = input;
        this.output = output;
        this.traceType = traceType;
        this.callType = callType;
        this.rewardType = rewardType;
        this.gas = gas;
        this.gasUsed = gasUsed;
        this.subtraces = subtraces;
        this.traceAddress = traceAddress;
        this.error = error;
        this.status = status;
        this.migrationType = migrationType;
    }
}
