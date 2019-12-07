import fs from "fs";
import {getConnection} from "typeorm";
import WalletBalance from "../../../entity/processed/WalletBalance";

// this query was too big to be done on the code or via entity manager
const TOP_BALANCES_SQL = fs.readFileSync(`${process.cwd()}/sql/topEthereumBalances.sql`, "utf8");

/**
 * Service class to access database functions and do queries or fetch entities
 */
export default class EthereumService {

    public static getInstance(): EthereumService {
        if (!this.instance) {
            this.instance = new EthereumService();
        }
        return this.instance;
    }

    private static instance: EthereumService;

    /**
     * This method executes the query to fetch the top balances, basically this query does:
     * 1. Select all value from transactions received to an address
     * 2. Select all value from transactions sent from an address
     * 3. Calculate fees credits and debits
     * 4. Sum credits and subtract debits
     */
    public async getTopBalances(): Promise<any> {
        const databaseResults = await getConnection().manager.query(TOP_BALANCES_SQL);
        if (databaseResults) {
            const topBalances: WalletBalance[] = [];
            databaseResults.forEach((result: any) => {
                topBalances.push(new WalletBalance(result.address, result.balance));
            });
            return topBalances;
        }
        return null;
    }
}
