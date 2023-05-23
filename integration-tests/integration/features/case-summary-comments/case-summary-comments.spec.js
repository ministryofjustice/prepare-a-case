/* global cy */
import 'cypress-axe'
import { And, When, Then } from 'cypress-cucumber-preprocessor/steps'

And('I should see {int} previous comments', $int => {
  cy.get('#previousComments').within(() => {
    cy.get('tr').should('have.length', $int)
  })
})

When('I click the button to {string} comment', $string => {
  cy.get('#save-comments').contains($string).click()
})

Then('I should see the comments textarea highlighted as error', () => {
  cy.get('#comment').should('have.class', 'govuk-textarea--error')
})

Then('I should see an error message {string}', $string => {
  cy.get('#comment-error').should('include.text', $string)
})

Then('I should NOT see an error message', $string => {
  cy.get('#comment-error').should('not.exist')
})

When('I enter a comment {string} in the comment box', $comment => {
  cy.get('#case-comment').type($comment)
})

And('I should see the following comments with the comment, author and date commented on', $data => {
  $data.raw().forEach((dataRow, index) => {
    cy.get('.govuk-table__body > .govuk-table__row').eq(index).within(() => {
      const tableCell = cy.get('.govuk-table__cell').eq(0)
      tableCell.within(() => {
        cy.get('.case-comments-comment-display').contains(dataRow[0])
        cy.get('.govuk-caption-m').contains(dataRow[1])
        cy.get('.govuk-link').should(`${dataRow[2] === 'Show delete link' ? 'exist' : 'not.exist'}`)
      })
    })
  })
})

And('I click Delete on the below comment located in table row {int}', ($int, $data) => {
  const dataRow = $data.raw()[0]
  cy.get('.govuk-table__body > .govuk-table__row').eq($int - 1).within(() => {
    const tableCell = cy.get('.govuk-table__cell').eq(0)
    tableCell.within(() => {
      cy.get('.case-comments-comment-display').contains(dataRow[0])
      cy.get('.govuk-caption-m').contains(dataRow[1])
      cy.get('.govuk-link').should('exist').click()
    })
  })
})
