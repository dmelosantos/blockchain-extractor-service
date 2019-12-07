# blockchain-extractor-service
Service that capture stream of information from Blockchain Networks and process them

#Installation

## Without Docker
First install node 12

On the project dir:
```shell script
npm install
```

To start the server

```shell script
npm run dev
```

That's it, the server will start on the port 5000

There is the route for the top balances http://localhost:5000/top/balances

And the VUE application will run on http://localhost:5000

You can change all configs on the .env file

## With Docker

Install Docker on your machine

Also install Docker Compose

Go to project root folder and run the following command:

```shell script
docker build -t blockchain-extractor .
```

Then:

```shell script
docker run -p 5000:5000 -p 5001:5001 -d blockchain-extractor
```

And

```shell script
docker-compose up
```

That's it!

Access your server on http://localhost:5000/

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

## TODO

Until december 7th TODOs:
- Add unit tests
- Add integration tests
- Add e2e tests
