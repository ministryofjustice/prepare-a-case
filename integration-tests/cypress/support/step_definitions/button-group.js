/* global cy expect */
const { Then } = require('@badeball/cypress-cucumber-preprocessor')

Then('I should have a button group with a button labeled {string}', $label => {
    cy.get('.govuk-button-group.page-button-group').should('exist')
    cy.get('.govuk-button-group.page-button-group').within(() => {
        cy.get('.govuk-button').contains($label).should('exist')
    })
})
  
Then('I should have a button group with a Cancel link with href {string}', $href => {
    cy.get('.govuk-button-group.page-button-group').should('exist')
    cy.get('.govuk-button-group.page-button-group').within(() => {
        cy.get('.govuk-link').contains('Cancel').should('exist').should('have.attr', 'href').and('include', $href)
    })
})