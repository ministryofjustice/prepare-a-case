/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'

And('I should see the following alerts', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.pac-key-details-bar__status').contains(text)
  })
})

And('I should see the following {string} summary table', ($string, $data) => {
  $data.raw().forEach((row, index) => {
    row.forEach((text, index2) => {
      cy.get(`${$string === 'defendant details' ? '.govuk-table' : '.govuk-table ~ .govuk-table'} > .govuk-table__body > .govuk-table__row`).within(() => {
        cy.get(index2 % 2 === 0 ? '.govuk-table__header' : '.govuk-table__cell').eq(index).contains(text)
      })
    })
  })
})
