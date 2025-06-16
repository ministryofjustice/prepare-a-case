const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const { parseCypressDate } = require('../utils/time')

Then('I should see a summary card with id {string} and title {string}', ($id, $title) => {
  cy.get(`#${$id}`).should('have.attr', 'class').and('include', 'govuk-summary-card')
  cy.get(`#${$id}`).within(() => {
    cy.get('h3').contains($title).should('have.attr', 'class').and('include', 'govuk-summary-card__title')
  })
})

Then('I should see a summary card with id {string} and action', ($id, $data) => {
  cy.get(`#${$id}`).within(() => {
    $data.raw().forEach((row) => {
      cy.get('.govuk-summary-card__action').within(() => {
        const link = () => cy.get('.govuk-link')
        link().contains(row[0]).should('have.attr', 'href').and('include', row[2])
        link().within(() => {
          cy.get('span').contains(row[1]).should('exist')
        })
      })
    })
  })
})

Then('I should see a summary card with id {string} and summary list rows', ($id, $data) => {
  cy.get(`#${$id}`).within(() => {
    const content = () => cy.get('.govuk-summary-card__content')
    content().should('exist')
    content().within(() => {
      cy.get('.govuk-summary-list').should('exist')
      $data.raw().forEach((row, index) => {
        cy.get('.govuk-summary-list__row').eq(index).within(() => {
          cy.get('dt').contains(row[0]).should('have.attr', 'class').and('include', 'govuk-summary-list__key')
          const value = () => cy.get('dd')
          row.slice(1).forEach((expected) => {
            if (expected) {
              value().contains(parseCypressDate(expected, 'D MMM YYYY'))
            }
          })
        })
      })
    })
  })
})
