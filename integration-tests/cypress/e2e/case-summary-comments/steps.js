import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

Then('I should see {int} previous comments', $int => {
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

Then('I should see the following comments with the comment, author and date commented on', $data => {
  $data.raw().forEach((dataRow, index) => {
    cy.get('.govuk-table__body > .govuk-table__row').eq(index).within(() => {
      const tableCell = cy.get('.govuk-table__cell').eq(0)
      tableCell.within(() => {
        cy.get('.case-comments-comment-display').contains(dataRow[0])
        cy.get('.govuk-caption-m').contains(dataRow[1])
        if (dataRow[2] === 'Show delete link') {
          cy.get('.case-comment-delete').should('exist')
        } else {
          cy.get('.case-comment-delete').should('not.exist')
        }
        if (dataRow[3] === 'Show edit link') {
          cy.get('.case-comment-edit').should('exist')
        } else {
          cy.get('.case-comment-edit').should('not.exist')
        }
        if (dataRow[4] === 'Legacy') {
          cy.get('.case-comment-warning-container').should('exist')
        } else {
          cy.get('.case-comment-warning-container').should('not.exist')
        }
      })
    })
  })
})

const getCommentsRow = rowNum => cy.get('.govuk-table__body > .govuk-table__row').eq(rowNum - 1)

Then('I click {string} on the below comment located in table row {int}', ($link, $int, $data) => {
  const dataRow = $data.raw()[0]
  getCommentsRow($int).within(() => {
    const tableCell = cy.get('.govuk-table__cell').eq(0)
    tableCell.within(() => {
      cy.get('.case-comments-comment-display').contains(dataRow[0])
      cy.get('.govuk-caption-m').contains(dataRow[1])
      cy.get('.govuk-link').eq($link === 'Delete' ? 1 : 0).contains($link).should('exist').click()
    })
  })
})

Then('I click {string} on the edit textarea in row {int}', ($string, $int) => {
  getCommentsRow($int).within(() => {
    cy.get('.govuk-table__cell').eq(0).within(() => {
      cy.get('.case-comment-edit-container').should('be.visible').within(() => {
        cy.get('a').contains('Cancel').should('exist').click()
      })
    })
  })
})

Then('the comment displayed in row {int} should be converted into textarea with content {string}', ($int, $string) => {
  getCommentsRow($int).within(() => {
    cy.get('.govuk-table__cell').eq(0).within(() => {
      cy.get('.case-comment-display-container').should('not.be.visible')
      cy.get('.case-comment-edit-container').should('be.visible').within(() => {
        cy.get('textarea').should('have.value', $string)
        cy.get('a').contains('Cancel').should('exist')
        cy.get('button').contains('Save').should('exist')
      })
    })
  })
})

Then('the edit textarea in row {int} should be transformed to comment display with comment {string}', ($int, $string) => {
  getCommentsRow($int).within(() => {
    cy.get('.govuk-table__cell').eq(0).within(() => {
      cy.get('.case-comment-edit-container').should('not.be.visible')
      cy.get('.case-comment-display-container').should('be.visible').within(() => {
        cy.get('.case-comments-comment-display').should('have.text', $string)
        cy.get('a').eq(0).should('contain.text', 'Edit')
        cy.get('a').eq(1).should('contain.text', 'Delete')
      })
    })
  })
})
