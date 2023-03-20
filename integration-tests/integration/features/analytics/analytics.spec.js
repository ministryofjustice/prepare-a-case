/* global cy */
import { And, Then } from 'cypress-cucumber-preprocessor/steps'

Then('the "appInsights" object should be defined on the window', () => {
  cy.window().should('have.property', 'appInsights')
})

And('the "appInsights" object should have properties and methods', $data => {
  $data.raw().forEach((dataRow) => {
    cy.window().should('have.nested.property', dataRow[0])
  })
})
