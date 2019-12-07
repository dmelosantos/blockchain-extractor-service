import {Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import TraceAction from "./TraceAction";
import Transaction from "./Transaction";

/**
 * Sample Trace object returned from a RPC call
 * {
 *     "action": {
 *       "callType": "call",
 *       "from": "0x1c39ba39e4735cb65978d4db400ddd70a72dc750",
 *       "gas": "0x13e99",
 *       "input": "0x16c72721",
 *       "to": "0x2bd2326c993dfaef84f696526064ff22eba5b362",
 *       "value": "0x0"
 *     },
 *     "blockHash": "0x7eb25504e4c202cf3d62fd585d3e238f592c780cca82dacb2ed3cb5b38883add",
 *     "blockNumber": 3068185,
 *     "result": {
 *       "gasUsed": "0x183",
 *       "output": "0x0000000000000000000000000000000000000000000000000000000000000001"
 *     },
 *     "subtraces": 0,
 *     "traceAddress": [
 *       0
 *     ],
 *     "transactionHash": "0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",
 *     "transactionPosition": 2,
 *     "type": "call"
 *   }
 */
@Entity()
export default class Trace {

    /**
     * The ID represents the block string parsed from hexadecimal
     */
    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    id!: string;

    @Column((type) => TraceAction)
    action: TraceAction;

    @Column({length: 255})
    @Index()
    blockHash: string;

    @Column({length: 255})
    blockNumber: string;

    @Column({nullable: true, length: 255})
    gasUsed: string;

    @Column({type: "text"})
    output: string;

    @Column({length: 4096})
    subtraces: string;

    @Column({type: "text"})
    traceAddress: string;

    @Column({length: 255})
    transactionHash: string;

    @Column({length: 255})
    transactionPosition: string;

    @Column({length: 255})
    type: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(action: TraceAction, blockHash: string, blockNumber: string, gasUsed: string,
                output: string, subtraces: string, traceAddress: string, transactionHash: string,
                transactionPosition: string, type: string, migrationType: MigrationType) {
        this.action = action;
        this.blockHash = blockHash;
        this.blockNumber = blockNumber;
        this.gasUsed = gasUsed;
        this.output = output;
        this.subtraces = subtraces;
        this.traceAddress = traceAddress;
        this.transactionHash = transactionHash;
        this.transactionPosition = transactionPosition;
        this.type = type;
        this.migrationType = migrationType;
    }
}
