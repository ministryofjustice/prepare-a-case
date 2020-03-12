/* global cy */
import moment from 'moment'
import { And } from 'cypress-cucumber-preprocessor/steps'
import { getMonthsAndDays } from '../../../../routes/middleware/defaults'

And('I should see the following alerts', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.pac-key-details-bar__status').contains(text)
  })
})

And('I should see the {string} summary table', ($position, $data) => {
  $data.raw().forEach((row, index) => {
    row.forEach((text, index2) => {
      cy.get(`${$position === 'first' ? '.govuk-table' : '.govuk-table ~ .govuk-table'} > .govuk-table__body > .govuk-table__row`).within(() => {
        cy.get(index2 % 2 === 0 ? '.govuk-table__header' : '.govuk-table__cell').eq(index).contains(text)
      })
    })
  })
})

And('I should see the correct time elapsed between {string} and {string}', ($startDate, $endDate) => {
  const startDate = moment($startDate, 'YYYY-MM-DD')
  const endDate = moment($endDate, 'YYYY-MM-DD').isAfter() ? moment() : moment($endDate, 'YYYY-MM-DD')
  cy.get('.qa-elapsed-time').contains(getMonthsAndDays(startDate, endDate))
})
