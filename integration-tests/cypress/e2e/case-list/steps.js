import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

Then('I should see the current day as {string}', $string => {
  cy.get('.qa-case-list-day').eq(0).contains($string)
})

Then('I should see {string} days navigation bar', $string => {
  cy.get('.pac-days-navigation').should('exist')
  cy.get('.pac-days-navigation-item').should('have.length', Cypress.env($string))
})

Then('I should not see days navigation bar', () => {
  cy.get('.pac-days-navigation').should('not.exist')
})

Then('I should see the matching inset text {string}', $string => {
  cy.get('.pac-inset-text').within(() => {
    cy.get('.govuk-body').contains($string).should('exist')
  })
})

Then('I should see secondary text {string}', $string => {
  cy.get('.pac-secondary-text').contains($string).should('exist')
})

Then('I should not see that any defendants have possible NDelius records', () => {
  cy.get('.pac-inset-text').should('not.exist')
})

Then('I should see the last updated as {string}', $string => {
  cy.get('.pac-last-updated-stamp').contains($string)
})

Then('I should see the next update as {string}', $string => {
  cy.get('.pac-next-update-stamp').contains($string)
})

Then('I should see pagination text {string}', $string => {
  cy.get('.moj-pagination__results').contains($string)
})

Then('I should not see the table list', () => {
  cy.get('.govuk-table').should('not.exist')
})

Then('I should see pagination', () => {
  cy.get('.moj-pagination').should('exist')
})

Then('I should see pagination link {string} with href {string}', ($string, $href) => {
  cy.get('.moj-pagination__link').contains($string).should('exist').should('have.attr', 'href').and('include', $href)
})

Then('I should see pagination page {string} highlighted', $string => {
  cy.get('.moj-pagination__item--active').contains($string).should('exist')
})

Then('I should not see pagination link {string}', $string => {
  cy.get('.moj-pagination__link').contains($string).should('not.exist')
})

Then('I should not see pagination', () => {
  cy.get('.moj-pagination').should('not.exist')
})

Then('I should not see filters', () => {
  cy.get('[data-test=pac-filter-card]').should('not.exist')
})

Then('I click pagination link {string}', $string => {
  cy.get('.moj-pagination__link').contains($string).click()
})

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

When('I click the date navigation element {int}', $int => {
  cy.get('.pac-days-navigation-item__link').eq($int - 1).click()
})
