/* global cy */
import { When } from 'cypress-cucumber-preprocessor/steps'

When('I click the {string} filter button', $string => {
  cy.get('.pac-filter-button').contains($string).click()
})

When('I select the {string} filter', $string => {
  cy.get('[type="checkbox"]').check($string)
})

When('I click the clear {string} filter tag', $string => {
  cy.get('.pac-filter__tag').contains($string).click()
})
