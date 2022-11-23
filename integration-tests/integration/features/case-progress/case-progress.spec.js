/* global cy */
import 'cypress-axe'
import { And, Then } from 'cypress-cucumber-preprocessor/steps'

And('I should see {int} previous hearings headers', $int => {
  cy.get('.app-summary-card').within(() => {
    cy.get('header').should('have.length', $int)
  })
})

And('I click delete hearing note with id {string} on hearing {string}', ($noteId, $hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get(`#previous-note-${$noteId}`).within(() => {
      cy.get('a').click()
    })
  })
})

And('I should see the following hearings with the hearing type label, hearing details and next appearance badge if applicable', $data => {
  $data.raw().forEach((dataRow, index) => {
    cy.get('.app-summary-card').eq(index).within(() => {
      const caseProgressCardHeader = cy.get('.app-summary-card__header > .app-summary-card__title').eq(0)
      caseProgressCardHeader.within(() => {
        cy.get('.govuk-heading-s').contains(dataRow[0])
        cy.get('.govuk-body').contains(dataRow[1])
        if (dataRow[2] === 'NEXT APPEARANCE') {
          cy.get('.pac-badge').should('exist')
        } else {
          cy.get('.pac-badge').should('not.exist')
        }
      })
      const caseProgressCardPreviousNote = cy.get('.app-summary-card__body')
      caseProgressCardPreviousNote.within(() => {
        cy.get('span').should('exist')
      })
      const caseProgressCardBody = cy.get('.app-summary-card__body').eq(0)
      caseProgressCardBody.within(() => {
        cy.get('summary > span').contains('Add a note')
      })
    })
  })
})

And('the note with the id {string} on hearing {string} is filled with the text {string}', ($noteId, $hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get(`#previous-note-${$noteId}`).should('exist')
  })
})

Then('should appears a css hidden modal which displays information', () => {
  cy.get('.popup-toggle').should('exist')
})

And('I should see a warning icon', () => {
  cy.get('.govuk-warning-text__icon').should('exist')
})

And('I should see the text heading message {string}', $string => {
  cy.get('.govuk-warning-text__text').contains($string)
})

And('I should see the text body message {string}', $string => {
  cy.get('.govuk-body-s').contains($string)
})
Then('I click the {string} button to be back on my page', $string => {
  cy.get('#close-btn').contains($string).click({ force: true })
})
