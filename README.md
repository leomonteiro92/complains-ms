[![Build Status](https://travis-ci.org/leomonteiro92/complains-ms.svg?branch=master)](https://travis-ci.org/leomonteiro92/complains-ms) [![Coverage Status](https://coveralls.io/repos/leomonteiro92/complains-ms/badge.svg?branch=master)](https://coveralls.io/r/leomonteiro92/complains-ms?branch=master)

# Node.JS API

API to manage complains

## Requirements

- Node.js (Preferable the LTS Version Erbium)
- MongoDB (Latest stable)
- Optional: Docker and Docker Compose: Stable versions

## Running API

### 1) Ensure databases are running

For convenience, you can run the databases using docker containers. Ensure that the host ports are available:

```bash
docker-compose up -d
```

To stop the databases:

```bash
docker-compose stop
```

### 2) Install dependencies

After cloning the repository, move to the main directory and run

```git
npm install
```

### 3) Create the environment

Create a file `.env` and set the following variables:

| Variable | Description                                                                       |
| -------- | --------------------------------------------------------------------------------- |
| DB_URL   | Database hostname. Ex.: `127.0.0.1`                                               |
| PORT     | The default port which the application server listens. Default: `3000`            |
| NODE_ENV | Environment to run the application. Accepts `development`, `test` or `production` |

After the enviroment is set, run:

```bash
source .env
```

### 4) Run the tests

To run tests, use:

```bash
npm test
```

### 5) Start the application

```bash
npm start
```

### 5) Create a new complain (local environment)

```bash
curl -X POST \
  http://localhost:3000 \
  -H 'Content-Type: application/json' \
  -d '{
	"title": "Complain #1",
	"description": "Complain near to Sao Paulo",
	"latitude": -23.6105101,
	"longitude": -46.637934,
	"company": "12345"
}'
```
