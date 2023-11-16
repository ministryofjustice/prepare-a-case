/* global cy */
import { When } from 'cypress-cucumber-preprocessor/steps'

When('I navigate to the {string} protected route', $route => {
  cy.visit($route, {
    headers: {
      authorization: 'Basic dGVzdDp0ZXN0'
    },
    failOnStatusCode: false
  })
})
