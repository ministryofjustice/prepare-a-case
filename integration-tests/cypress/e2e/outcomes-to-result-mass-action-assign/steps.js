import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

When('I check a checkbox for a case record', () => {
  cy.get('.common_checker_toggle_item input[type="checkbox"]')
    .first()
    .check({ force: true })
})

Then('the checkbox is checked', () => {
  cy.get('.common_checker_toggle_item input[type="checkbox"]')
    .first()
    .should('be.checked')
})

When('I check the mass-action checkbox', () => {
  cy.get('.common_checker_toggle_apply input[type="checkbox"]')
    .first()
    .check({ force: true })
})

When('I uncheck the mass-action checkbox', () => {
  cy.get('.common_checker_toggle_apply input[type="checkbox"]')
    .first()
    .uncheck({ force: true })
})

Then('checkboxes for all cases are checked', () => {
  cy.get('.common_checker_toggle_item input[type="checkbox"]')
    .should('be.checked')
})

Then('the option \'Assign to Me\' in the Action menu is enabled', () => {
  cy.get('.moj-button-menu >button')
    .click()
  cy.get('.common_checker_toggle_action')
    .should('not.be.disabled')
})

Then('the option \'Assign to Me\' in the Action menu is disabled', () => {
  cy.get('.moj-button-menu >button')
    .click()
  cy.get('.common_checker_toggle_action')
    .should('be.disabled')
})

When('I click to assign the case', () => {
  cy.get('.moj-button-menu >button')
    .click()
  cy.get('.common_checker_toggle_action')
    .click()
})

Then('I see a success banner stating {string}', text => {
  cy.get('.govuk-notification-banner__content >.govuk-notification-banner__heading')
    .contains(text)
})

Then('checkboxes for all cases are not checked', () => {
  cy.get('.common_checker_toggle_item input[type="checkbox"]')
    .should('not.be.checked')
})
