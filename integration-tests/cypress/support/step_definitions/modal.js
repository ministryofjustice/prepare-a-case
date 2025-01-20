const { Then, When } = require('@badeball/cypress-cucumber-preprocessor')

Then('I should {string} the {string} modal', ($expected, $id) => {
  const expected = $expected.toLowerCase()
  expect(['see', 'not see']).to.include(expected)
  cy.get(`#${$id}`).should(`${expected === 'not see' ? 'not.' : ''}be.visible`)
})

Then('the {string} modal should have the text heading {string}', ($id, $string) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('h2').contains($string).should('be.visible')
  })
})

Then('the {string} modal should have the text paragraph {string}', ($id, $string) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('p').contains($string).should('be.visible')
  })
})

Then('the {string} modal should have the error message {string}', ($id, $string) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('p.govuk-error-message').contains($string).should('be.visible')
  })
})

Then('the {string} modal should have the button {string}', ($id, $string) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('button').contains($string).should('exist')
  })
})

Then('the {string} modal should have the link as button {string}', ($id, $string) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('a').contains($string).should('exist').should('have.attr', 'role').and('include', 'button')
  })
})

Then('the {string} modal should have the Cancel link as button', ($id) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('a').contains('Cancel').should('exist').should('have.attr', 'role').and('include', 'button')
  })
})

Then('I should see the link {string} {string} open a modal with the {string} trigger', ($string, $expected, $trigger) => {
  const expected = $expected.toLowerCase()
  expect(['will', 'will not']).to.include(expected)
  cy.get('.govuk-link').contains($string).should('have.attr', 'class')
    .and(`${expected === 'will not' ? 'not.' : ''}contain`, $trigger)
})

Then('the {string} modal should have a select input with label {string}', ($id, $label) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('label').contains($label).should('exist')
  })
})

Then('the {string} modal should have a select input with items', ($modal, $data) => {
  cy.get(`#${$modal} select option`).then(opts => {
    const optionValues = [...opts].map(opt => opt.innerText.trim())
    const expectedValues = $data.raw().map(d => d[0].trim())
    expect(optionValues).to.deep.eq(expectedValues)
  })
})

When('I select the {string} option from the select on the {string} modal', ($option, $modal) => {
  cy.get(`#${$modal} select`).select($option)
})


When('I click the {string} modal {string} button', ($id, $buttonText) => {
  cy.get(`#${$id} button`).contains($buttonText).click()
})

When('I click the {string} modal {string} link', ($id, $string) => {
  cy.get(`#${$id}`).within(() => {
    cy.get('.govuk-link').contains($string).click()
  })
})

When('I click the {string} modal {string} link as button', ($id, $string) => {
  cy.get(`#${$id} a`).contains($string).click()
})

When('I click the Cancel option on the {string} modal', ($id) => {
  cy.get(`#${$id} a`).contains('Cancel').click()
})