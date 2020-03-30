/* global cy */
import moment from 'moment'
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getMonthsAndDays } from '../../../../routes/middleware/defaults'

let currentDefendantScenario

const world = {
  local: {
    caseSummary: {
      notKnownDefendant: {
        caseNo: 8678951874,
        name: 'Kara Ayers'
      },
      currentDefendant: {},
      currentDefendantWithBreach: {
        caseNo: 6627839278,
        name: 'Webb Mitchell'
      },
      previouslyKnownDefendant: {

      }
    }
  },
  dev: {
    caseSummary: {
      notKnownDefendant: {

      },
      currentDefendant: {},
      currentDefendantWithBreach: {
        caseNo: 1585562016194,
        name: 'Mr Joe JMBBLOGGS'
      },
      previouslyKnownDefendant: {

      }
    }
  }
}

function getCurrentDefendant() {
  const env = Cypress.env('ENVIRONMENT')
  return world[env].caseSummary[currentDefendantScenario]
}

And('I am looking at a current defendant with breach', () => {
  currentDefendantScenario = 'currentDefendantWithBreach'
})

And('I am looking at a not known defendant', () => {
  currentDefendantScenario = 'notKnownDefendant'
})

When('I navigate to the case details route', function () {
  const caseNo = getCurrentDefendant().caseNo
  cy.visit(`case/${caseNo}/details`)
})

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

Then('I should see a summary list', ($data) => {
  cy.get('.govuk-summary-list').should('exist')
})

Then('I click the defendant name link', () => {
  const name = getCurrentDefendant().name
  cy.get('.govuk-link').contains(name).click()
})

Then('I should see the heading has the defendant name', function () {
  const name = getCurrentDefendant().name
  cy.get('h1').contains(name)
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
