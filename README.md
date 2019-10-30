# Prepare a case

A service to allow probation staff to prepare court cases. 

---

##Running the app for development
The project uses [Yarn](http://yarnpkg.com) instead of npm for dependency management.

For code quality the project adheres to [JavaScript Standard Style](https://standardjs.com/) which requires minimal configuration of your chosen IDE.

Unit tests use [Jest](https://jestjs.io).

Integration tests use [Cypress](https://www.cypress.io) and employ [Gherkin](https://cucumber.io/docs/gherkin/reference/) features, integration tests also check for accessibility violations with [Axe](https://www.deque.com/axe/axe-for-web/documentation/api-documentation).

###Getting started
Install dependencies using ```yarn```, ensuring you are using >= ```Node v12.13.0```.

And then, to build the assets and start the app with ```yarn start```

###Run linter
```yarn lint```

###Run unit tests
```yarn unit-test```

###Running integration tests
For local running, start the application:

```yarn start```

Then run the integration tests:

```yarn int-test```

Or run tests with the Cypress UI:

```yarn int-test:ui```
