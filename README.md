# blockchain-extractor-service
Service that capture stream of information from Blockchain Networks and process them


#Overview
The work trial is a way for us to:
Gauge your interest in the position
Assess your technical abilities related to the role
See how quickly you can get up to speed on the cryptocurrency and blockchain space

#Requirements
Create a streaming ETL pipeline for extracting blockchain (Ethereum) data into a database (Mysql) instance needed for building and executing general SQL queries.

Create a Typescript server/job/script to pull data from an Ethereum client (ie. Parity) and push it to a Mysql instance.

Client will be Ethereum, but consider in the design that it may be another blockchain network.

Database will be Mysql, but consider in the design that it may be other type of database.

Consider in the design the ability to keep a database up-to-date after an initial export-load. ie. have a cron-job running that detects new blocks and uploads them to the database handling reorgs.

Expose a simple API endpoint to show some data. Some (non-mandatory) examples are:

-Balance of every Eth address on every day

-Top Ethereum Balances

-USD volume per token over time

-Block rewards daily by miner

-Hashrate by day

Others you think would be relevant and interesting as an end user.

Create a simple FE in a modern framework (Vue or React preferred) to display the data. As a backend engineer this can be very simple (ie. 1 page with dropdown and a graph).

Containerize with Docker so it can be easily built and run.

#Resources

Owned node: we can give you a free account. https://app.deploy.radar.tech/

https://github.com/blockchain-etl/ethereum-etl . Sample python ETL. You can copy the modeling from there, but its design is a bit inflexible to us (limited export options, no option to ‘update’ a database)

Typeorm (multi-database support): https://github.com/typeorm/typeorm

#Network clients

https://github.com/paritytech/parity-ethereum/

https://github.com/ethereum/go-ethereum/wiki/geth

#Deliverables
Backend repo with your Typescript ETL logic

# Decisions
## Architecture

The API is a express app with the following:

-> Abstract Chain Layer, the design is thought on using a BlockchainEtlProcessor abstraction, so we can decouple the pulling and updating the data for any Chain (implemented only Ethereum)

-> TypeORM for the database entities

-> WebSocket to listen the realtime updates

-> RPC and Polling to do the initial loading using queues (KUE implementation on Redis) to control the flow of the MySQL

-> Socket.io to transmit to the UI realtime information

-> Express Endpoints to access queries and processed results from MySQL

## Pulling information of Node frequency

I checked if the node had batch requests but it didn't. I used Radar Deploy Kovan Shared nodes.

Without the batch requests I implemented pulling logics with delays to avoid 429 errors.

Even if there is an error, retry logic has been implemented to fetch the records

Improvements to be done:

- Add dead letter queue for jobs that failed to save on the database, so we can recover fetchs done to the server
- Implement batch requests and reduce the number of roundtrips to the server

## Reorgs logic

Created the algorithm in two parts:
- First extract the blocks from the server (initial load)
- While it is doing the first load, already register a WebSocket and keep adding new heads
- By using upsert, even if new blocks appear and a reorg happens, with the WS logic + Upsert the blocks would be updated in realtime

## Usage of queues

To avoid overflowing the database which can have less connections than we can have on requests from blocks/traces/logs a queue was added to control the inserts on the database

## Socket.io for the UI

In order to communicate with the UI, there is a secondary Socket implementation using Socket.IO which gives us full duplex communication and allows for broadcasts.
So the server receive in pure WebSocket from the Chain Node and emit a broadcast to the UI with the realtime information

## VUE.JS

The UI has the top balances query as a sample, the realtime blocks and transaction appearing

Notes on the code: there is TODO and Refactors on the code on purpose, they don't mean I was lazy, it was because I limited the scope as to show a real daily to daily coding from my side.

Until december 7th TODOs:
- Add unit tests
- Add integration tests
- Add e2e tests
