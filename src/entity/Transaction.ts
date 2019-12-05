import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {MigrationType} from "../commons/Constants";
import Block from "./Block";

@Entity()
export default class Transaction {
    /** hash: Hash - 32 Bytes - hash of the transaction. */
    @PrimaryColumn({length: 255})
    hash: string;

    /** nonce: Quantity - the number of transactions made by the sender prior to this one. */
    @Column({length: 255})
    nonce: string;

    /** blockHash: Hash - 32 Bytes - hash of the block where this transaction was in. null when its pending. */
    @Column({length: 255})
    @Index()
    blockHash: string;

    /** id from the table Block representing the field blockNumber:
     * Quantity or Tag - block number where this transaction was in. null when its pending. */
    @ManyToOne((type) => Block, (block) => block.transactions)
    @Index()
    block: Block;

    /** transactionIndex: Quantity - integer of the transactions index position in the block. null when its pending. */
    @Column({length: 255})
    transactionIndex: string;

    /** from: Address - 20 Bytes - address of the sender. */
    @Column({length: 255})
    @Index()
    from: string;

    /** to: Address - 20 Bytes - address of the receiver. null when its a contract creation transaction. */
    @Column({length: 255, nullable: true})
    @Index()
    to: string;

    /** value: Quantity - value transferred in Wei. */
    @Column({length: 255})
    value: string;

    /** gasPrice: Quantity - gas price provided by the sender in Wei. */
    @Column({length: 255})
    gasPrice: string;

    /** gas: Quantity - gas provided by the sender. */
    @Column({length: 255})
    gas: string;

    /** input: Data - the data send along with the transaction. */
    @Column({length: 4096})
    input: string;

    /** v: Quantity - the standardised V field of the signature. */
    @Column({length: 255})
    v: string;

    /** standardV: Quantity - the standardised V field of the signature (0 or 1). */
    @Column({length: 255})
    standardV: string;

    /** r: Quantity - the R field of the signature. */
    @Column({length: 255})
    r: string;

    /** raw: Data - raw transaction data */
    @Column({length: 4096})
    raw: string;

    /** publicKey: Hash - public key of the signer. */
    @Column({length: 4096})
    publicKey: string;

    /** chainId: Quantity - the chain id of the transaction, if any. */
    @Column({length: 255, nullable: true})
    @Index()
    chainId: string;

    /** creates: Hash - creates contract hash */
    @Column({length: 255, nullable: true})
    creates: string;

    /**
     * condition: Object - (optional) conditional submission, Block number in block or timestamp
     *  in time or null. (parity-feature)
     *  TODO this is parity feature, so should not be on the model
     */
    @Column({length: 255, nullable: true})
    condition: string;

    @Column({
        enum: MigrationType,
        type: "enum",
    })
    migrationType: MigrationType;

    constructor(hash: string, nonce: string, blockHash: string, block: Block, transactionIndex: string,
                from: string, to: string, value: string, gasPrice: string, gas: string, input: string,
                v: string, standardV: string, r: string, raw: string, publicKey: string, chainId: string,
                creates: string, condition: string, migrationType: MigrationType) {
        this.hash = hash;
        this.nonce = nonce;
        this.blockHash = blockHash;
        this.block = block;
        this.transactionIndex = transactionIndex;
        this.from = from;
        this.to = to;
        this.value = value;
        this.gasPrice = gasPrice;
        this.gas = gas;
        this.input = input;
        this.v = v;
        this.standardV = standardV;
        this.r = r;
        this.raw = raw;
        this.publicKey = publicKey;
        this.chainId = chainId;
        this.creates = creates;
        this.condition = condition;
        this.migrationType = migrationType;
    }

}
