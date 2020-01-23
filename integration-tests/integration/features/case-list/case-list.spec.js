/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'
import moment from 'moment'

And('I should see sub navigation with three dates', () => {
  cy.get('.moj-sub-navigation__link').eq(0).contains(moment().format('dddd, D MMMM YYYY'))
  cy.get('.moj-sub-navigation__link').eq(1).contains(moment().add(1, 'days').format('dddd, D MMMM YYYY'))
  cy.get('.moj-sub-navigation__link').eq(2).contains(moment().add(2, 'days').format('dddd, D MMMM YYYY'))
})

And('I should see a table with correct headings', () => {
  cy.get('.govuk-table__header').eq(0).contains('Defendant')
  cy.get('.govuk-table__header').eq(1).contains('Probation record')
  cy.get('.govuk-table__header').eq(2).contains('Offence')
  cy.get('.govuk-table__header').eq(3).contains('Listing')
  cy.get('.govuk-table__header').eq(4).contains('Session')
  cy.get('.govuk-table__header').eq(5).contains('Court')
})
