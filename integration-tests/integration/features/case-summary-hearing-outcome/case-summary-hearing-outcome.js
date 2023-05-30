/* global cy expect When */
import { And } from 'cypress-cucumber-preprocessor/steps'

And('hearing {string} should have hearing outcome {string} sent to admin on {string}', ($hearingId, $outcome, $outcomeDate) => {
  cy.get(`#case-progress-hearing-${$hearingId} .govuk-notification-banner--success`).within(() => {
    cy.get('span').should($span => {
      expect($span.get(0).innerText.trim()).to.eq($outcome)
      expect($span.get(1).innerText.trim()).to.eq(`Sent to admin on ${$outcomeDate}`)
    })
  })
})

And('hearing {string} should have button "Send outcome to admin"', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-button').contains('Send outcome to admin').should('exist')
  })
})

And('I should {string} the modal popup to add hearing outcome', ($expected) => {
  const expected = $expected.toLowerCase()
  expect(['see', 'not see']).to.include(expected)
  cy.get('#add-hearing-outcome-modal').should(`${expected === 'not see' ? 'not.' : ''}be.visible`)
})

And('I should NOT see a modal popup to add hearing outcome', ($hearingId) => {
  cy.get('#add-hearing-outcome-modal').should('not.exist')
})

And('the modal popup should have text paragraph {string}', ($pContent) => {
  cy.get('#add-hearing-outcome-modal p').contains($pContent).should('be.visible')
})

And('the modal popup should have a select input with items', ($data) => {
  cy.get('#add-hearing-outcome-modal select option').then(opts => {
    const optionValues = [...opts].map(opt => opt.innerText.trim())
    const expectedValues = $data.raw().map(d => d[0].trim())
    expect(optionValues).to.deep.eq(expectedValues)
  })
})

And('the modal popup should have the button "Send to admin"', () => {
  cy.get('#add-hearing-outcome-modal button').contains('Send to admin').should('exist')
})

And('the modal popup should have the close button', () => {
  cy.get('#add-hearing-outcome-modal button').contains('X').should('exist')
})

When('I click "Send outcome to admin" for hearing {string}', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-button').contains('Send outcome to admin').click()
  })
})

When('I click button {string} on hearing outcome modal popup', ($buttonText) => {
  cy.get('#add-hearing-outcome-modal button').contains($buttonText).click()
})

When('I select "Report requested" from select options', () => {
  cy.get('#add-hearing-outcome-modal select').select('Report requested')
})

And('I click "Send to admin" button', () => {
  cy.get('#add-hearing-outcome-modal button').contains('Send to admin').click()
})
