/* global cy expect */
import { When, Then} from '@badeball/cypress-cucumber-preprocessor'

const getIframe = () => {
  return cy
    .get('iframe[data-cy="render-frame"]')
}

const getIframeDocument = () => {
  return getIframe()
    // Cypress "its" command can access deep properties using dot notation
    // https://on.cypress.io/its
    .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  // get the document
  return getIframeDocument()
    // automatically retries until body is loaded
    .its('body').should('not.be.undefined')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    .then(cy.wrap)
}

const getPreviewRender = () => {
  return getIframeBody().find('#preview-render')
}

When('I navigate to the {string} protected route', $route => {
  cy.visit($route, {
    headers: {
      authorization: 'Basic dGVzdDp0ZXN0'
    },
    failOnStatusCode: false
  })
})

Then('I should see the {string} preview title', $string => {
  getIframeBody().find('h2').contains($string)
})

Then('I should see the {string} in the preview html', $string => {
  getPreviewRender().should('have.html', $string)
})

Then('the preview html should have a height of {string}', string => {
  getIframe().should('have.attr', 'height', string)
})

Then('I should {string} an error message', $expected => {
  const expected = $expected.toLowerCase()
  expect(['see', 'not see']).to.include(expected)
  cy.get('.govuk-error-message').should(`${expected === 'not see' ? 'not.' : ''}be.visible`)
})

When('I type the text {string} into the input field', $string => {
  cy.get('input[data-cy="notification-input"]').type($string)
})

Then('the submit button should be {string}', $expected => {
  cy.get('button[data-cy="notification-submit"]').should($expected === 'enabled' ? 'not.be.disabled' : 'be.disabled')
})
