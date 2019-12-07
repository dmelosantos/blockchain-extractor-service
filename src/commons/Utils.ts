import BigNumber from "bignumber.js";
import * as request from "request-promise-native";

/**
 * Stylish hack to add delays between calls without resorting to setTimeout throughout the code
 * @param ms
 */
export function delay(ms: number) {
    return new Promise( (resolve) => setTimeout(resolve, ms) );
}

export async function makeRpcCall(url: string, method: string, params: any[]): Promise<any> {
    return request.post(url, {
        headers: {
            "Content-Type": "application/json",
        },
        json: {
            id: "1",
            jsonrpc: "2.0",
            method,
            params,
        },
    });
}

export function convertWeiToEth(value: string): string {
    return new BigNumber(value, 10).multipliedBy("1").decimalPlaces(BigNumber.ROUND_DOWN)
        .dividedBy("1000000000000000000").toString(10);
}
