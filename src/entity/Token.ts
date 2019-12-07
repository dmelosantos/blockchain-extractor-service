import {Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Transaction from "./Transaction";

/**
 * Class representing blocks in Chain Networks
 */
@Entity()
export default class Token {

    /**
     * The ID represents the log index field
     */
    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    id: string;

    @Column({length: 255})
    @Index()
    address: string;

    @Column({length: 255})
    symbol: string;

    @Column({length: 255})
    name: string;

    @Column({length: 255})
    decimals: string;

    @Column({length: 255})
    totalSupply: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(id: string, address: string, symbol: string, name: string, decimals: string, totalSupply: string,
                migrationType: MigrationType) {
        this.id = id;
        this.address = address;
        this.symbol = symbol;
        this.name = name;
        this.decimals = decimals;
        this.totalSupply = totalSupply;
        this.migrationType = migrationType;
    }
}
