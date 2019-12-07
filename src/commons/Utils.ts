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
