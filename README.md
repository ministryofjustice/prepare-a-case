# Prepare a case

Prepare a case is a service that allows probation staff to prepare court cases. 

## Prerequisities
Before you begin, ensure you have met the following requirements:
* You have Node.js [LTS](https://nodejs.org/en/about/releases/) (Erbium) >= v12.13.0
* You have [Yarn](http://yarnpkg.com) installed

For code quality the project adheres to [JavaScript Standard Style](https://standardjs.com/) which requires minimal configuration of your chosen IDE.

Unit tests use [Jest](https://jestjs.io).

Integration tests use [Cypress](https://www.cypress.io) and employ [Gherkin](https://cucumber.io/docs/gherkin/reference/) features, integration tests also check for accessibility violations with [Axe](https://www.deque.com/axe/axe-for-web/documentation/api-documentation).

## To use Prepare a case, follow these steps:

Install dependencies using 

```
yarn
```

And then, to build the assets and start the app with
```
yarn start
```

## For development, there are additional tasks:

### Run linter
```
yarn lint
```

### Run unit tests
```
yarn unit-test
```

### Run integration tests
For local running, start the application:

```
yarn start
```

Then run the integration tests:

```
yarn int-test
```

Or run the integration tests with the Cypress UI:

```
yarn int-test:ui
```

## Environment variables

### Court case service
Default: http://localhost:8082

Specify the court-case-service URL with ```COURT_CASE_SERVICE_URL```
