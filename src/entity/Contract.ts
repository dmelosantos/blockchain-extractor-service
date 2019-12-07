import {Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Transaction from "./Transaction";

@Entity()
export default class Contract {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    id: string;

    @Column({length: 255})
    @Index()
    address: string;

    @Column({length: 255})
    functionSigHashes: string;

    @Column()
    isErc20: boolean;

    @Column()
    isErc721: boolean;

    @Column({length: 255})
    @Index()
    blockNumber: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(id: string, address: string, functionSigHashes: string, isErc20: boolean, isErc721: boolean,
                blockNumber: string, migrationType: MigrationType) {
        this.id = id;
        this.address = address;
        this.functionSigHashes = functionSigHashes;
        this.isErc20 = isErc20;
        this.isErc721 = isErc721;
        this.blockNumber = blockNumber;
        this.migrationType = migrationType;
    }
}
