/* global cy */
import { And, Then } from 'cypress-cucumber-preprocessor/steps'
import moment from 'moment'

const dateFormat = 'dddd D MMM'

And('I should see sub navigation with default dates', () => {
  cy.get('.moj-sub-navigation__link').eq(0).contains(moment().format(dateFormat))
  cy.get('.moj-sub-navigation__link').eq(1).contains(moment().add(1, 'days').format(dateFormat))
  cy.get('.moj-sub-navigation__link').eq(2).contains(moment().add(2, 'days').format(dateFormat))
})

And('I should see the following table', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.govuk-table__head > .govuk-table__row').within(() => {
      cy.get('.govuk-table__header').eq(index).contains(text)
    })
  })

  $data.rows().forEach((row, index) => {
    row.forEach((text, index2) => {
      cy.get('.govuk-table__body > .govuk-table__row').eq(index).within(() => {
        cy.get('.govuk-table__cell').eq(index2).contains(text)
      })
    })
  })
})

And('The following defendant names should be links', $data => {
  $data.raw()[0].forEach((string, index) => {
    cy.get('.govuk-link.govuk-link--no-visited-state').eq(index).contains(string)
  })
})

And('I should not see the table list', () => {
  cy.get('.govuk-table').should('not.exist')
})

Then('Display “last updated” time with a timestamp of the most recent Libra data', () => {
  const formattedDate = moment().format(dateFormat)
  cy.get('.pac-last-updated').contains(`Last updated ${formattedDate} at 08:30`)
})
