/* global cy */
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import 'cypress-axe'

Given('I am a registered user', () => {
  // @TODO: Implement registered user test
})

When('I open the application', () => {
  cy.visit('/')
  cy.injectAxe()
})

When('I navigate to the {string} route', $route => {
  cy.visit(`${$route}`)
  cy.injectAxe()
})

Then('I should be on the {string} page', $title => {
  cy.get('title').contains(`${$title} - `)
  cy.get('h1').contains($title)
})

And('I should see the caption {string}', $caption => {
  cy.get('.govuk-caption-xl').contains($caption)
})

And('There should be no a11y violations', () => {
  cy.checkA11y('main#main-content')
})

And('I should see the body text {string}', $text => {
  cy.get('.govuk-body').contains($text)
})
