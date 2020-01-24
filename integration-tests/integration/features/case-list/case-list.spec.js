/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'
import moment from 'moment'

And('I should see sub navigation with three dates', () => {
  cy.get('.moj-sub-navigation__link').eq(0).contains(moment().format('dddd, D MMMM YYYY'))
  cy.get('.moj-sub-navigation__link').eq(1).contains(moment().add(1, 'days').format('dddd, D MMMM YYYY'))
  cy.get('.moj-sub-navigation__link').eq(2).contains(moment().add(2, 'days').format('dddd, D MMMM YYYY'))
})

And('I should see a table with specific headings', () => {
  cy.get('.govuk-table__header').eq(0).contains('Defendant')
  cy.get('.govuk-table__header').eq(1).contains('Probation record')
  cy.get('.govuk-table__header').eq(2).contains('Offence')
  cy.get('.govuk-table__header').eq(3).contains('Listing')
  cy.get('.govuk-table__header').eq(4).contains('Session')
  cy.get('.govuk-table__header').eq(5).contains('Court')
})

And('I should see a list of defendants', () => {
  cy.get('.govuk-link.govuk-link--no-visited-state').eq(0).contains('JCONE')
  cy.get('.govuk-link.govuk-link--no-visited-state').eq(1).contains('Mr Joe JMBBLOGGS')
})

And('I should not see a table list', () => {
  cy.get('.govuk-table').should('not.exist')
})
