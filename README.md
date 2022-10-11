# Prepare a case
[![CircleCI](https://circleci.com/gh/ministryofjustice/prepare-a-case.svg?style=svg)](https://circleci.com/gh/ministryofjustice/prepare-a-case)

Prepare a case is a service that allows probation staff to prepare court cases. 

For more informations, check our [Runbook](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/2548662614/Prepare+a+Case+for+Sentence+RUNBOOK)

## Prerequisities
Before you begin, ensure you have met the following requirements:
* You have Node.js [LTS](https://nodejs.org/en/about/releases/) (Dubnium) >= v16.14.2

For code quality the project adheres to [JavaScript Standard Style](https://standardjs.com/) which requires minimal configuration of your chosen IDE.

Unit tests use [Jest](https://jestjs.io).

Integration tests use [Cypress](https://www.cypress.io) and employ [Gherkin](https://cucumber.io/docs/gherkin/reference/) features, integration tests also check for accessibility violations with [Axe](https://www.deque.com/axe/axe-for-web/documentation/api-documentation).

## To use Prepare a case, follow these steps:

Install dependencies using 

```
npm i
```

And then, to build the assets and start the app with (substituting in a valid client secret for the dev environment)
```
env API_CLIENT_SECRET={client-secret} COURT_CASE_SERVICE_URL=http://court-case-service-dev.apps.live-1.cloud-platform.service.justice.gov.uk PAC_ENV=dev ENABLE_CASE_COMMENTS=true ENABLE_CASE_PROGRESS=true NOMIS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth npm run start
```

Or to use alongside a local instance of *court-case-service* 

```
env COURT_CASE_SERVICE_URL=http://127.0.0.1:8080 npm run start
```

## For development, there are additional tasks:

### Start app with mocked backend

If unspecified, the app will use your local court-case-service app but you can also use WireMock.
 
Start the standalone WireMock server
```
java -jar wiremock-jre8-standalone-2.32.0.jar --global-response-templating --port 9091
```

And then, to build assets and start app with
```
PAC_ENV=dev ENABLE_CASE_COMMENTS=true ENABLE_CASE_PROGRESS=true npm run start-feature

```

This will watch for changes in the application JavaScript and Nunjucks templates and automatically restart as required.

This will also ensure that the application does not restart due to changes to test scripts. 

### Run linter
```
npm run lint
```

### Run unit tests
```
npm run unit-test
```

### Run PACT tests
```
npm run pact-test
```

### Run integration tests
For local running, start redis instance by:

`docker-compose -f docker-compose.test.yml up`

Start the standalone WireMock server
```
java -jar wiremock-jre8-standalone-2.32.0.jar --global-response-templating --port 9091
```

Then run the server in test mode by:

```
npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)
```

Then run the integration tests:

```
npm run int-test
```

Or run the integration tests with the Cypress UI:

```
npm run int-test:ui
```

**N.B.** If your tests fail at `cy.task('getLoginUrl').then(cy.visit)` try restarting your standalone WireMock server

## Environment variables

### Court case service
Default:  http://127.0.0.1:9091

Specify the court-case-service URL with `COURT_CASE_SERVICE_URL`

### Cases per page
Default: 20

Specify the number of cases to display, per page with `CASES_PER_PAGE`

### HMPPS User Preferences service
Default:  http://127.0.0.1:9091

Specify the hmpps-user-preferences URL with `USER_PREFERENCE_SERVICE_URL`

## Dependencies
* `hmpps-auth` - for authentication
* `redis` - session store and token caching
