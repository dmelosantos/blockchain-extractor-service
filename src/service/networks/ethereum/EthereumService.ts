import fs from "fs";
import {getConnection} from "typeorm";
import {convertWeiToEth} from "../../../commons/Utils";
import WalletBalance from "../../../entity/processed/WalletBalance";

// this query was too big to be done on the code or via entity manager
const TOP_BALANCES_SQL = fs.readFileSync(`${__dirname}/sql/topEthereumBalances.sql`, "utf8");

export default class EthereumService {

    public static getInstance(): EthereumService {
        if (!this.instance) {
            this.instance = new EthereumService();
        }
        return this.instance;
    }

    private static instance: EthereumService;

    public async getTopBalances(): Promise<any> {
        const databaseResults = await getConnection().manager.query(TOP_BALANCES_SQL);
        if (databaseResults) {
            const topBalances: WalletBalance[] = [];
            databaseResults.forEach((result: any) => {
                topBalances.push(new WalletBalance(result.balance, result.address));
            });
            return topBalances;
        }
        return null;
    }
}
