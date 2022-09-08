/* global cy */
import 'cypress-axe'
import { And } from 'cypress-cucumber-preprocessor/steps'

And('I should see {int} previous hearings', $int => {
  cy.get('#caseHearingsForm').within(() => {
    cy.get('.app-summary-card').should('have.length', $int)
  })
})

And('I should see the following hearings with the hearing type label, hearing details', $data => {
  $data.raw().forEach((dataRow, index) => {
    cy.get('.app-summary-card').eq(index).within(() => {
      const caseProgressCardHeader = cy.get('.app-summary-card__header > .app-summary-card__title').eq(0)
      caseProgressCardHeader.within(() => {
        cy.get('.govuk-heading-s').contains(dataRow[0])
        cy.get('.govuk-body').contains(dataRow[1])
      })
      const caseProgressCardBody = cy.get('.app-summary-card__body > .govuk-details').eq(0)
      caseProgressCardBody.within(() => {
        cy.get('summary > span').contains('Add a note')
      })
    })
  })
})
