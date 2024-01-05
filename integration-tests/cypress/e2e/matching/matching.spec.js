/* global cy */
import { Then } from '@badeball/cypress-cucumber-preprocessor'

Then('I should see the match confirmation banner message {string}', $string => {
  cy.get('.moj-banner__message').contains($string)
})

Then('I should see the following matched text', $data => {
  $data.raw().flat().forEach((text, index) => {
    cy.get('mark').eq(index).contains(text)
  })
})
