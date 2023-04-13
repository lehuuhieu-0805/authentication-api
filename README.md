## Installation

```bash
$ yarn install
```

## Usage

#### Configuration

- create a new database

- create a file .env in root directory and add the following variables of file .env.example

- run migration to create tables

```bash
$ yarn run migration:run
```

#### Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

#### Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
