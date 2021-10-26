/* global cy */
import { And, When } from 'cypress-cucumber-preprocessor/steps'

And('I should see the current day as {string}', $string => {
  cy.get('.qa-case-list-day').eq(0).contains($string)
})

And('I should see 7 days navigation bar', () => {
  cy.get('.pac-days-navigation').should('exist')
})

And('I should not see 7 days navigation bar', () => {
  cy.get('.pac-days-navigation').should('not.exist')
})

And('I should see the matching inset text {string}', $string => {
  cy.get('.pac-inset-text').within(() => {
    cy.get('.govuk-body').contains($string).should('exist')
  })
})

And('I should see secondary text {string}', $string => {
  cy.get('.pac-secondary-text').contains($string).should('exist')
})

And('I should not see that any defendants have possible NDelius records', () => {
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

When('I click the date navigation element {int}', $int => {
  cy.get('.pac-days-navigation-item__link').eq($int - 1).click()
})
