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

Balance of every Eth address on every day

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


