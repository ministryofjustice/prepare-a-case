# Prepare a case
[![CircleCI](https://circleci.com/gh/ministryofjustice/prepare-a-case.svg?style=svg)](https://circleci.com/gh/ministryofjustice/prepare-a-case)

Prepare a case is a service that allows probation staff to prepare court cases. 

For more informations, check our [Runbook](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/2548662614/Prepare+a+Case+for+Sentence+RUNBOOK)

## Heads up

For code quality the project adheres to [JavaScript Standard Style](https://standardjs.com/) which requires minimal configuration of your chosen IDE.

Unit tests use [Jest](https://jestjs.io).

Integration tests use [Cypress](https://www.cypress.io) and employ [Gherkin](https://cucumber.io/docs/gherkin/reference/) features, integration tests also check for accessibility violations with [Axe](https://www.deque.com/axe/axe-for-web/documentation/api-documentation).

## To use Prepare a case, follow these steps:

Build, install and run with the API mocked and JS/CSS rebuilding on-the-fly using the usual docker compose commands:

```
docker compose build
DISPLAY= docker compose up --build
DISPLAY= docker compose up
```

Note the DISPLAY= .This is required to prevent passing your X DISPLAY (on Mac and Linux) into Docker, which Cypress requires for CI.
The intention is to wire Cypress for interactive UI mode in the future which will use the same env key. 

These commands are aliased as

```
npm start
npm run build
```

With node being inside a docker container so to are the `node_modules` and if you make a change to package.json you will
need to rebuild the docker container. Rebuilding the containers can be is fairly slow but you shouldn't need to do it day-to-day.

Note that changes to wiremocks will not auto refresh, you'll need to restart the specific wiremock container.

```
docker compose restart hmpps-user-preferences
docker compose restart hmpps-auth
docker compose restart court-case-service
```

To override the API mocks with development service(s) running on your local machine use something like

```
docker compose build -f docker-compose.yml -f compose/user-auth.yml -f compose/user-preferences.yml -f compose/court-case-service.yml
```

It would be nice if you could swap out just one service but in reality they have dependencies based on the seed data 
that was included with them. For this reason you may be better working against the cloud dev API image, as this will 
have data matching the other services it replies on. To do run the standard ```docker compose up``` but instead swap out some env variables. 
You can do this by including the following in a root .env file.

```
API_CLIENT_SECRET={client-secret} 
COURT_CASE_SERVICE_URL=http://court-case-service-dev.apps.live-1.cloud-platform.service.justice.gov.uk 
NOMIS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
```

Feature flags can also be enabled by the same method. Note that several are turned on by default to allow for integration tests to pass.
You may need to specifically turn them off.

```
PAC_ENV=dev 
ENABLE_CASE_COMMENTS=true 
ENABLE_CASE_PROGRESS=true
```

Fair warning, the feature flags are a bit of a mess. Some need to be on for unit tests to work and then off for integration tests to work.

## Continuous Integration

The project is configured to use one Dockerfile throughout and relies exclusively on Docker. This means you don't need to have NodeJS installed locally.

You may notice a lot of commands don't use ```npx``` - and this is with good reason. ```npx``` manipulates the upstream error codes which in turn means commands like ```jest``` don't work as expected. 

## For development

With the docker containers up several commands add additional testing functionality.

To run all tests use ```npm test```

### Run linter
```
npm run test:lint
```

### Run unit tests
```
npm run test:unit
```

You can also target one test file using something like

```
npm run test:unit -- tests/routes/thefile.test.js --collectCoverage=false
```

### Run PACT tests
```
npm run test:pact
```

### Run Integration tests
```
npm run test:int
```

If you want to target one test you can temporarily slide that name.feature into the cypress.config.js!

TBC - CURRENTLY INTERACTIVE IS NOT AVAILABLE AND WILL BE FIXED IN THE NEAR FUTURE

Cypress interactive UI needs a bit more work to get the X DISPLAY piping from docker.

For Mac install XQuartz ```https://www.xquartz.org/?ref=cypress-io.ghost.io```

By default your DISPLAY=0:0 is used, which usually translates as the first screen on the first graphical output device. 
If you need to use something else you can do something like ```DISPLAY=0:1 docker compose up```. 

## Environment variables

### HMPPS Authentication service

For development purposes we use two URL's, one for the oauth redirect
and one for the internal (docker network) token fetching.

```
NOMIS_AUTH_URL=http://hmpps-auth:8080/auth
NOMIS_AUTH_URL_REDIRECT=http://localhost:9091/auth
```

If NOMIS_AUTH_URL_REDIRECT is not specified it will inherit from NOMIS_AUTH_URL, however once it's set (by say the default docker-compose.yml)
and you want to target an external URL (such as cloud dev oauth) then you should overwrite both (with the same value).

### Court case service

Specify the court-case-service URL with `COURT_CASE_SERVICE_URL`

### Cases per page
Default: 20

Specify the number of cases to display, per page with `CASES_PER_PAGE`

### HMPPS User Preferences service

Specify the hmpps-user-preferences URL with `USER_PREFERENCE_SERVICE_URL`

# Setting up maintenance/holding page during downtime

Before starting to release the changes that involve downtime please use the below command to enable the maintenance page.
Please verify and update the namespace in the command before running.

```kubectl set env deployment -n court-probation-dev prepare-a-case MAINTENANCE_MODE=true```

The pods will be restarted after running the command. Ensure the pod restarts are complete before checking the maintenance page.

After the release is complete, please disable the maintenance page by running the below command.

```kubectl set env deployment -n court-probation-dev prepare-a-case MAINTENANCE_MODE=false```

The pods will be restarted after running the command. Ensure the pod restarts are complete before checking the application is working correctly.

Please note that the above environment variable changes are temporary and will be overwritten by any subsequent prepare-a-case deployments and the maintenance page will be disabled.