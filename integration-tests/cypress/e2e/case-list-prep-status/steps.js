import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

Then('any prep status drop down should have items', $items => {

  $items.raw().forEach(item => {
    cy.get('.workflow-tasks-status-selector').first().select(item[0]).should('exist')
  })
})

When('I set the prep status for select {int} to {string} the change invokes a {int}', (index, text, responseCode) => {

  cy.intercept({
    method: 'POST',
    url: '/workflow/tasks/prep/state?*',
    hostname: 'localhost'
  }).as('submit')

  cy.get('.workflow-tasks-status-selector')
    .eq(index-1)
    .select(text)
    .trigger('change')

  cy.wait('@submit').then(interception => {
    expect(interception.request.body).to.include('state')
    expect(interception.response.statusCode).to.eq(responseCode)
  })
})

Then('I see a window.alert with message {string}', $message => {

  cy.on('window:alert', txt => {
    expect(txt).to.be($message);
  })
})

Then('select {int} has a state of {string}', (index, label) => {

  cy.get('.workflow-tasks-status-selector')
    .eq(index-1)
    .find(':selected')
    .contains(label)
})
