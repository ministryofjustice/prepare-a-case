import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

Then('I should {string} the modal popup to assign hearing outcome', ($expected) => {
  const expected = $expected.toLowerCase()
  expect(['see', 'not see']).to.include(expected)
  cy.get('#assign-outcome-modal').should(`${expected === 'not see' ? 'not.' : ''}be.visible`)
})

Then('the modal popup should have text heading {string}', ($pContent) => {
  cy.get('#assign-outcome-modal h2').contains($pContent).should('be.visible')
})

Then('the modal popup should have text paragraph {string}', ($pContent) => {
  cy.get('#assign-outcome-modal p').contains($pContent).should('be.visible')
})

Then('the modal popup should have the button "Assign to me"', () => {
  cy.get('#assign-outcome-modal button').contains('Assign to me').should('exist')
})

Then('the modal popup should have the link "View without assigning"', () => {
  cy.get('#assign-outcome-modal a').contains('View without assigning').should('exist')
})

Then('the modal popup should have the close button', () => {
  cy.get('#assign-outcome-modal button').contains('X').should('exist')
})

When('I click "Assign to me"', () => {
  cy.get('#assign-outcome-modal').within(() => {
    cy.get('.govuk-button').contains('Assign to me').click()
  })
})

When('I click "View without assigning"', () => {
  cy.get('#assign-outcome-modal').within(() => {
    cy.get('.govuk-link').contains('View without assigning').click()
  })
})

When('I click button {string} on hearing outcome modal popup', ($buttonText) => {
  cy.get('#assign-outcome-modal button').contains($buttonText).click()
})
