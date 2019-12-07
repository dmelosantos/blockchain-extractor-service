import {Get, JsonController, Param} from "routing-controllers";
import EthereumService from "../service/networks/ethereum/EthereumService";

@JsonController()
export class EthereumController {

    private service: EthereumService = EthereumService.getInstance();

    @Get("/top/balances")
    async getTopBalances() {
        const topBalances = await this.service.getTopBalances();
        return JSON.stringify(topBalances, null, 2);
    }
}
