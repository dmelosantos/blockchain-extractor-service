import {Chain, EthereumClient, EthereumNetworkType} from "../../src/commons/constants";
import ExtractorService from "../../src/service/ExtractorService";

describe("ExtractorService Test Suite", () => {
    it("Should initialize the extractor service with an Ethereum Network", () => {
        const extractorService: ExtractorService = new ExtractorService(Chain.ETHEREUM,
            EthereumNetworkType.KOVAN.toString(), EthereumClient.PARITY.toString());
        expect(extractorService).toBeDefined();
    });
});
