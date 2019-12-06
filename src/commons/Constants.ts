export enum Chain {
    ETHEREUM, BITGO,
}

export enum EthereumClient {
    PARITY, GETH,
}

export enum EthereumNetworkType {
    KOVAN, ROPSTEN, RINKEBY,
}

/**
 * Enum to differentiate if the block was imported through WebSocket or RPC
 * This allows the extractor service to start only from the last imported RPC block (ETL initial loading)
 */
export enum MigrationType {
    WS, RPC,
}

export enum ServerMode {
    LOAD, DYNAMIC, BOTH,
}
