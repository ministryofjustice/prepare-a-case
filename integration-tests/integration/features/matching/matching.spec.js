/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'

And('I should see the match confirmation banner message {string}', $string => {
  cy.get('.moj-banner__message').contains($string)
})

And('I should see the following matched text', $data => {
  $data.raw().flat().forEach((text, index) => {
    cy.get('mark').eq(index).contains(text)
  })

And('I should see the success banner message {string}', $string => {
  cy.get('.govuk-notification-banner__heading').contains($string)
  })
})
