import { Then } from '@badeball/cypress-cucumber-preprocessor'

Then('Defendant {string} should display the following {string} data', ($defendant, $header, $data) => {
  let headerIndex
  cy.contains('th', $header).invoke('index').then(index => {
    headerIndex = index
  })
  cy.contains('.govuk-table__cell', $defendant).parent().within(() => {
    if ($data.raw()[0].length > 1) {
      cy.get('.govuk-table__cell').eq(headerIndex).within(() => {
        cy.get('.govuk-list').within(() => {
          $data.raw()[0].forEach((text, index) => {
            cy.get('li').eq(index).should('contain.text', text)
          })
        })
      })
    } else {
      cy.get('.govuk-table__cell').eq(headerIndex).within(() => {
        cy.get('li').should('not.exist')
      })
      cy.get('.govuk-table__cell').eq(headerIndex).should('contain.text', $data.raw()[0])
    }
  })
})
