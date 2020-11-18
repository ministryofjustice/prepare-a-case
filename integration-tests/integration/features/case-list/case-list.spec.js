/* global cy */
import { And, When } from 'cypress-cucumber-preprocessor/steps'

And('I should see the caption with the court name {string}', $string => {
  cy.get('.qa-court-name').contains($string)
})

And('I should see the current day as {string}', $string => {
  cy.get('.qa-case-list-day').eq(0).contains($string)
})

And('I should see day navigation with {string}', $string => {
  cy.get('.pac-pagination-link--text').eq(0).contains($string)
})

And('I should see the matching inset text {string}', $string => {
  cy.get('.pac-inset-text').within(() => {
    cy.get('.govuk-body').contains($string).should('exist')
  })
})

And('I should not see that any defendants have possible nDelius records', () => {
  cy.get('.pac-inset-text').should('not.exist')
})

And('I should see a tab with text {string}', $string => {
  cy.get('.govuk-tabs__tab').contains($string)
})

And('I should see the last updated as {string}', $string => {
  cy.get('.pac-last-updated-stamp').contains($string)
})

And('I should see the next update as {string}', $string => {
  cy.get('.pac-next-update-stamp').contains($string)
})

And('I should see pagination text {string}', $string => {
  cy.get('.moj-pagination__results').contains($string)
})

And('I should not see the table list', () => {
  cy.get('.govuk-table').should('not.exist')
})

And('I should see pagination', () => {
  cy.get('.moj-pagination').should('exist')
})

And('I should see pagination link {string} with href {string}', ($string, $href) => {
  cy.get('.moj-pagination__link').contains($string).should('exist').should('have.attr', 'href').and('include', $href)
})

And('I should see pagination page {string} highlighted', $string => {
  cy.get('.moj-pagination__item--active').contains($string).should('exist')
})

And('I should see a count of {string}', $string => {
  cy.get('.govuk-heading-m').contains(`${$string}`).should('exist')
})

And('I should see medium heading with text {string}', $string => {
  cy.get('.govuk-heading-m').contains($string).should('exist')
})

And('I should not see pagination link {string}', $string => {
  cy.get('.moj-pagination__link').contains($string).should('not.exist')
})

And('I should not see pagination', () => {
  cy.get('.moj-pagination').should('not.exist')
})

And('I should not see filters', () => {
  cy.get('.pac-filter-card').should('not.exist')
})

And('I click pagination link {string}', $string => {
  cy.get('.moj-pagination__link').contains($string).click()
})

When('I click the {string} filter button', $string => {
  cy.get('.pac-filter-button').contains($string).click()
})

When('I select the {string} filter', $string => {
  cy.get('[type="checkbox"]').check($string)
})

When('I click the {string} button', $string => {
  cy.get('button').contains($string).click()
})

When('I click the clear {string} filter tag', $string => {
  cy.get('.pac-filter__tag').contains($string).click()
})
