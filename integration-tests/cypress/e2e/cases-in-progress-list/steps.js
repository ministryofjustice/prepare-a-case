import { Then } from '@badeball/cypress-cucumber-preprocessor'

Then('I click the Move to resulted button for defendant {string}', $defendantName => {
  cy.contains('td', $defendantName)
    .siblings()
    .contains('Move to resulted')
    .click()
})
