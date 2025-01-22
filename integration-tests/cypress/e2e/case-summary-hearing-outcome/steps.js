import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

Then('hearing {string} should have hearing outcome {string} sent to admin on {string}', ($hearingId, $outcome, $outcomeDate) => {
  cy.get(`#case-progress-hearing-${$hearingId} .govuk-notification-banner--success`).within(() => {
    cy.get('span').should($span => {
      expect($span.get(0).innerText.trim()).to.eq($outcome)
      expect($span.get(1).innerText.trim()).to.eq(`Sent to admin on ${$outcomeDate}`)
    })
  })
})

Then('hearing {string} should have button "Send outcome to admin"', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-button').contains('Send outcome to admin').should('exist')
  })
})

Then('hearing {string} should have link "Edit"', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.hearing-outcome-edit').contains('Edit').should('exist')
  })
})

Then('hearing {string} should not have link "Edit"', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.hearing-outcome-edit').should('not.exist')
  })
})

When('I click "Send outcome to admin" for hearing {string}', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-button').contains('Send outcome to admin').click()
  })
})

When('I click "Edit" for hearing {string}', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.hearing-outcome-edit').contains('Edit').click()
  })
})
