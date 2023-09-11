/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'

And('I click the Move to resulted button for defendant {string}', $defendantName => {
  cy.get(`[data-test="qa-resulted-button-${$defendantName.split(' ').join('')}"]`).click()
})
