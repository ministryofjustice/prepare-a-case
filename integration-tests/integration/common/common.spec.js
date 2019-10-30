import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import 'cypress-axe'

Given(`I am a registered user`, () => {
  // @TODO: Implement registered user test
})

When(`I open the application`, () => {
  cy.visit('/')
  cy.injectAxe()
})

When(`I navigate to the {string} route`, $route => {
  cy.visit(`${ $route }`)
  cy.injectAxe()
})

Then(`I should be on the {string} page`, ($title) => {
  cy.get('h1').contains($title)
})

And(`There should be no a11y violations`, () => {
  cy.checkA11y('main#main-content')
})
