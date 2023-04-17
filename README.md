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

#### Restful API

```
Swagger: http://localhost:3000/api
```

##### Create a account

URL: http://localhost:3000/auth/sign-up (GET)

Body:

```json
{
  "email": "string",
  "password": "string"
}
```

##### Login

URL: http://localhost:3000/auth/sign-in (POST)

Body:

```json
{
  "email": "string",
  "password": "string"
}
```

##### Resend email verify

URL: http://localhost:3000/auth/resend-verify-code?email=<...> (GET)

##### Verify account

URL: http://localhost:3000/auth/verify-account?email=<...>&verifyCode=<...> (GET)

##### Get user info

URL: http://localhost:3000/auth/user (GET)

Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

#### GraphQL API

```
Playground: http://localhost:3000/graphql
```

##### Queries

- getUser (retrieve user info)

##### Mutations

- signUp (create a new account)

- signIn (login)

- resendVerifyCode (resend email verify)

- verifyAccount (verify account)

##### Example

```graphql
query {
  getUser {
    email
    password
    verifyCode
    isVerified
  }
}
```

```graphql
mutation {
  signIn(email: <email>, password: <password>) {
    access_token
  }
}
```

```graphql
mutation {
  signUp(email: <email>, password: <password>) {
    email
    isVerified
  }
}
```
