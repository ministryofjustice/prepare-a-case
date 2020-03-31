/* global cy */
import moment from 'moment'
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getMonthsAndDays } from '../../../../routes/middleware/defaults'
import World from '../../world/World'

const world = new World('caseSummary')

And('I am looking at a current defendant with breach', () => {
  world.scenario = 'currentDefendantWithBreach'
})

And('I am looking at a not known defendant', () => {
  world.scenario = 'notKnownDefendant'
})

When('I navigate to the case details route', function () {
  cy.visit(`case/${world.data.caseNo}/details`)
})

And('I should see the following alerts', $data => {
  $data.raw()[0].forEach(text => {
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

Then('I should see a summary list', ($data) => {
  cy.get('.govuk-summary-list').should('exist')
})

Then('I click the defendant name link', () => {
  cy.get('.govuk-link').contains(world.data.name).click()
})

Then('I should see the heading has the defendant name', () => {
  cy.get('h1').contains(world.data.name)
})

And('I should see the body text {string} and the defendant {string}', ($label, $key) => {
  cy.get('.govuk-body').contains(`${$label} ${world.data[$key]}`)
})

And('I should see the body text with the defendant {string} in bold', $key => {
  cy.get('.govuk-body').contains(world.data[$key]).should('exist').should('have.attr', 'class').and('include', 'govuk-!-font-weight-bold')
})

And('I should see the body text with the defendant {string}', $key => {
  cy.get('.govuk-body').contains(world.data[$key])
})

And('I should see the caption text with the defendant {string}', $key => {
  cy.get('.govuk-caption-m').contains(world.data[$key])
})

And('I should see the correct time elapsed between {string} and {string}', ($startDate, $endDate) => {
  const startDate = moment($startDate, 'YYYY-MM-DD')
  const endDate = moment($endDate, 'YYYY-MM-DD').isAfter() ? moment() : moment($endDate, 'YYYY-MM-DD')
  cy.get('.qa-elapsed-time').contains(getMonthsAndDays(startDate, endDate))
})

And('I should see the row with the key {string}', $title => {
  cy.get('.govuk-summary-list__key').contains($title)
})

And('I should see the value {string}', $title => {
  cy.get('.govuk-summary-list__value').contains($title)
})

Then('I should see a key details banner with a level 1 heading {string}', $title => {
  cy.get('h1').contains($title)
})

And('I should see a straight line divide', () => {
  cy.get('.pac-key-details-bar__divider').should('exist')
})

And('I should see the session is in Court {string} this morning with {string} listing', ($court, $listing) => {
  const date = moment().format('dddd Do MMMM')
  cy.get('.govuk-body').contains(`Court ${$court}, morning session, ${date} (${$listing} listing).`)
})
