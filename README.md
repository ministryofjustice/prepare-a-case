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
docker compose up --build
docker compose up
```

These commands are aliased as

```
npm start
npm run build
```

Recommended to run locally with the real oauth service, using the following command:
```
docker compose -f docker-compose.yml -f compose/user-auth.yml up --build
```

or its alias:
```
npm run start:auth
```

The oauth service will run locally and you will need to use the following login credentials...
```
Username: 'PREPARE_A_CASE_USER'
Password: 'password123456'
```

With node being inside a docker container so to are the `node_modules` and if you make a change to package.json you will
need to rebuild the docker container. Rebuilding the containers can be is fairly slow but you shouldn't need to do it day-to-day.

Note that changes to wiremocks will not auto refresh, you'll need to restart the specific wiremock container.

```
docker compose restart hmpps-user-preferences
docker compose restart hmpps-auth
docker compose restart court-case-service
```

To override the API mocks with development service(s) running on your local machine you can use...

```
docker compose -f docker-compose.yml -f compose/user-auth.yml -f compose/user-preferences.yml -f compose/court-case-service.yml up --build
```

To run a local branch of the court-case-service you can use the following. Note this isn't ideal because it's starting to enroach on the innards of the court-case-service internals. You may be better trying to start that stack as a separate entity and allowing it to connect to auth and prepare-a-case via URL ENV override. Pro's and cons!

if you do the following you'll need to build the court-case-service first using `./gradlew build`, which will then allow the DockerFile to be built. To do this you'll need Java 17 installed `brew install openjdk@17` and `export JAVA_HOME=`/usr/libexec/java_home -v 17` (on mac). This is subject to change.

```
docker compose -f docker-compose.yml -f compose/user-auth.yml -f compose/user-preferences.yml -f compose/court-case-service.yml -f compose/court-case-service-local.yml up --build
```

If you created containers previously you may have network not found issues, removing the old containers will fix it.

To point to cloud development services run the standard ```docker compose up``` but instead swap out some env variables. 
You can do this by including the following in a root .env file.

```
COURT_CASE_SERVICE_URL=https://prepare-a-case-dev.apps.live-1.cloud-platform.service.justice.gov.uk
NOMIS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
NOMIS_DISABLE_OAUTH_STATE=false
API_CLIENT_ID=prepare-a-case-for-court-1
API_CLIENT_SECRET=********
```

The API_CLIENT_ID and API_CLIENT_SECRET is held in kubernetes env. You can either get the values from another developer or fetch them.

```
kubectl -n court-probation-dev get pods
kubectl -n court-probation-dev exec podnamehere -- printenv
```

Feature flags can also be enabled by way of the .env file. Note that several are turned on by default to allow for integration tests to pass.
You may need to specifically turn them off.

```
PAC_ENV=dev 
ENABLE_CASE_COMMENTS=true 
ENABLE_CASE_PROGRESS=true
```

Fair warning, the feature flags are a bit of a mess. Some need to be on for unit tests to work and then off for integration tests to work.

## For running the whole stack locally via one docker compose

To run PAC and Court Case Service (CCS) locally simply execute the following:

```
docker compose -f docker-compose-full.yml up
```

Before executing the command make sure you have a .env file in the project route containing:

```
COURT_CASE_SERVICE_URL=http://host.docker.internal:8080
NOMIS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
API_CLIENT_ID=prepare-a-case-for-court-1
API_CLIENT_SECRET=********
```

Note that this will spin up nomis-oauth2 container so when logging in you will need your own username and password

## Continuous Integration

The project is configured to use one Dockerfile throughout and relies exclusively on Docker. This means you don't need to have NodeJS installed locally.

You may notice a lot of commands don't use ```npx``` - and this is with good reason. ```npx``` manipulates the upstream error codes which in turn means commands like ```jest``` don't work as expected. 

## For development

Node Debugger is available. Open chrome://inspect and ensure port 9229 is added. You may need to refresh the page for it to appear.

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

Firstly, run the app with the auth wiremock:
```
docker compose up
```

or the alias
```
npm run start
```

Then run the tests with:
```
npm run int-test
```

If you want to target one test you can temporarily slide that name.feature into the cypress.config.js!

### Run Integration tests with UI

Run the app in test mode as above, then run the tests with:
```
npm run int-test-ui
```

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

# Setting up maintenance/holding page during downtime

Before starting to release the changes that involve downtime please use the below command to enable the maintenance page.
Please verify and update the namespace in the command before running.

```kubectl set env deployment -n court-probation-dev prepare-a-case MAINTENANCE_MODE=true```

The pods will be restarted after running the command. Ensure the pod restarts are complete before checking the maintenance page.

After the release is complete, please disable the maintenance page by running the below command.

```kubectl set env deployment -n court-probation-dev prepare-a-case MAINTENANCE_MODE=false```

The pods will be restarted after running the command. Ensure the pod restarts are complete before checking the application is working correctly.

Please note that the above environment variable changes are temporary and will be overwritten by any subsequent prepare-a-case deployments and the maintenance page will be disabled.