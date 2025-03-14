const { Then } = require('@badeball/cypress-cucumber-preprocessor')

Then('I should see medium heading with text {string}', $string => {
  cy.get('.govuk-heading-m').contains($string).should('exist')
})

Then('I should see the heading {string}', $title => {
  cy.get('h1').contains($title)
})

Then('I should see the level 2 heading {string}', $title => {
  cy.get('h2').contains($title)
})

Then('I should see the level 3 heading {string}', $title => {
  cy.get('h3').contains($title)
})

Then('I should not see the heading level {int} with text {string}', ($level, $text) => {
  cy.get(`h${$level}`).contains($text).should('not.exist')
})

Then('I should see a level {int} heading with text {string}', ($level, $text) => {
    cy.get(`h${$level}`).contains($text).should('exist')
})

Then('I should see a {string} sized level {int} heading with text {string}', ($size, $level, $text) => {
    cy.get(`h${$level}.govuk-heading-${$size}`).contains($text).should('exist')
})

Then('I should see the following level {int} headings', ($level, $data) => {
    $data.raw()[0].forEach((text) => {
        cy.get(`h${$level}`).contains(text)
      })
})

Then('I should see the following {string} sized level {int} headings', ($size, $level, $data) => {
    $data.raw()[0].forEach((text) => {
        cy.get(`h${$level}.govuk-heading-${$size}`).contains(text)
      })
})