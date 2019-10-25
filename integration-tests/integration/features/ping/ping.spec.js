import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(`I should see the text {string}`, $text => {
  cy.contains($text)
});