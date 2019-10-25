import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

Given(`I am a registered user`, () => {
  // @TODO: Implement registered user test
});

When(`I open the application`, () => {
  cy.visit('/')
});

When(`I navigate to the {string} route`, $route => {
  cy.visit(`${$route}`)
});

Then(`I should be on the {string} page`, ($title) => {
  cy.get('h1').contains($title)
});