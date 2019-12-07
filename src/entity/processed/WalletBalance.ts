import {convertWeiToEth} from "../../commons/Utils";

export default class WalletBalance {
    public address: string;
    public balance: string;
    public formattedBalance: string;

    constructor(address: string, balance: string) {
        this.address = address;
        this.balance = balance;
        this.formattedBalance = convertWeiToEth(this.balance);
    }
}
