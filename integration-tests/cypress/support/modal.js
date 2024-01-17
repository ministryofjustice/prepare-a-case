const { Then, When } = require('@badeball/cypress-cucumber-preprocessor')

Then('I should {string} the {string} modal popup to assign hearing outcome', ($expected, $id) => {
  const expected = $expected.toLowerCase()
  expect(['see', 'not see']).to.include(expected)
  cy.get(`[data-cy=${$id}]`).should(`${expected === 'not see' ? 'not.' : ''}be.visible`)
})

Then('the {string} modal popup should have the close button', ($id) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('button').contains('X').should('exist')
  })
})

When('I click button {string} on {string} modal popup', ($buttonText, $id) => {
  cy.get(`#${$id} button`).contains($buttonText).click()
})

Then('I should see the link {string} {string} open a reassign modal', ($string, $expected) => {
  const expected = $expected.toLowerCase()
  expect(['will', 'will not']).to.include(expected)

  cy.get('.govuk-table').within(() => {
    cy.get('.govuk-link').contains($string).should('have.attr', 'class')
      .and(`${expected === 'will not' ? 'not.' : ''}contain`, 'pac-reassign')
  })
})

Then('the {string} modal popup should have text heading {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('h2').contains($string).should('be.visible')
  })
})

Then('the {string} modal popup should have text paragraph {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('p').contains($string).should('be.visible')
  })
})

Then('the {string} modal popup should have the button {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('button').contains($string).should('exist')
  })
})

Then('the {string} modal popup should have the link {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('a').contains($string).should('exist')
  })
})

When('I click the {string} modal {string} link', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('.govuk-link').contains($string).click()
  })
})