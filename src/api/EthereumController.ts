import {Body, Controller, Delete, Get, Param, Post, Put} from "routing-controllers";
import {getConnection} from "typeorm";
import EthereumService from "../service/networks/ethereum/EthereumService";

@Controller()
export class EthereumController {

    private service: EthereumService = EthereumService.getInstance();

    @Get("/top/balances")
    async getTopBalances() {
        const topBalances = await this.service.getTopBalances();
        return JSON.stringify(topBalances, null, 2);
    }

    @Get("/users/:id")
    getOne(@Param("id") id: number) {
        return "This action returns user #" + id;
    }

}
