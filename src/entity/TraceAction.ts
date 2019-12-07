import {Column, Index} from "typeorm";

/**
 * "action": {
 *       "callType": "call",
 *       "from": "0x1c39ba39e4735cb65978d4db400ddd70a72dc750",
 *       "gas": "0x13e99",
 *       "input": "0x16c72721",
 *       "to": "0x2bd2326c993dfaef84f696526064ff22eba5b362",
 *       "value": "0x0"
 *     },
 */
export default class TraceAction {
    @Column({length: 255})
    @Index()
    callType: string;

    @Column({length: 255})
    @Index()
    from: string;

    @Column({length: 255})
    gas: string;

    @Column({type: "text"})
    input: string;

    @Column({length: 255})
    @Index()
    to: string;

    @Column({length: 255})
    value: string;

    constructor(callType: string, from: string, gas: string, input: string, to: string, value: string) {
        this.callType = callType;
        this.from = from;
        this.gas = gas;
        this.input = input;
        this.to = to;
        this.value = value;
    }
}
