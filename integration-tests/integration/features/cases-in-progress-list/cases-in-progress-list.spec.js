/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'

And('I click the Move to resulted button for defendant {string}', $defendantName => {
  cy.contains('td', $defendantName)
    .siblings()
    .contains('Move to resulted')
    .click()
})
