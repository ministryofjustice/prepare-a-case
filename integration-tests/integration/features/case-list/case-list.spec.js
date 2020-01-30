/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'
import moment from 'moment'

And('I should see sub navigation with default dates', () => {
  cy.get('.moj-sub-navigation__link').eq(0).contains(moment().format('dddd, D MMMM YYYY'))
  cy.get('.moj-sub-navigation__link').eq(1).contains(moment().add(1, 'days').format('dddd, D MMMM YYYY'))
  cy.get('.moj-sub-navigation__link').eq(2).contains(moment().add(2, 'days').format('dddd, D MMMM YYYY'))
})

And('I should see the following table', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.govuk-table__head > .govuk-table__row').within(() => {
      cy.get('.govuk-table__header').eq(index).contains(text)
    })
  })

  $data.rows().forEach((row, index) => {
    row.forEach((text, index2) => {
      cy.get('.govuk-table__body > .govuk-table__row').eq(index).within(() => {
        cy.get('.govuk-table__cell').eq(index2).contains(text)
      })
    })
  })
})

And('The following defendant names should be links', $data => {
  $data.raw()[0].forEach((string, index) => {
    cy.get('.govuk-link.govuk-link--no-visited-state').eq(index).contains(string)
  })
})

And('I should see pagination text {string}', $string => {
  cy.get('.moj-pagination__results').contains($string)
})

And('I should not see the table list', () => {
  cy.get('.govuk-table').should('not.exist')
})

And('I should see pagination', () => {
  cy.get('.moj-pagination').should('exist')
})

And('I should see pagination link {string} with href {string}', ($string, $href) => {
  cy.get('.moj-pagination__link').contains($string).should('exist').should('have.attr', 'href').and('include', $href)
})

And('I should see pagination page {string} highlighted', $string => {
  cy.get('.moj-pagination__item--active').contains($string).should('exist')
})

And('I should not see pagination link {string}', $string => {
  cy.get('.moj-pagination__link').contains($string).should('not.exist')
})

And('I should not see pagination', () => {
  cy.get('.moj-pagination').should('not.exist')
})

And('I click pagination link {string}', $string => {
  cy.get('.moj-pagination__link').contains($string).click()
})
