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
env COURT_CASE_SERVICE_URL=http://court-case-service-dev.apps.live-1.cloud-platform.service.justice.gov.uk yarn start
```

Or to use alongside a local instance of *court-case-service* 

```
env COURT_CASE_SERVICE_URL=http://127.0.0.1:8080 yarn start
```

## For development, there are additional tasks:

### Start app with mocked backend

If unspecified, the app will use your local court-case-service app but you can also use WireMock.
 
Start the standalone WireMock server
```
java -jar wiremock-standalone-2.25.1.jar --global-response-templating --port 9091
```

And then, to build assets and start app with
```
yarn nodemon ./bin/www -e js,njk --ignore integration-tests/ --ignore tests/
```

This will watch for changes in the application JavaScript and Nunjucks templates and automatically restart as required.

This will also ensure that the application does not restart due to changes to test scripts. 

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
Default:  http://127.0.0.1:9091

Specify the court-case-service URL with ```COURT_CASE_SERVICE_URL```

### Cases per page
Default: 20

Specify the number of cases to display, per page with ```CASES_PER_PAGE```
