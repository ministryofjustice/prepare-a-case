/* global cy */
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import moment from 'moment'

const dateFormat = 'dddd D MMM'

And('I should see sub navigation with default dates', () => {
  cy.get('.moj-sub-navigation__link').eq(0).contains(moment().format(dateFormat))
  cy.get('.moj-sub-navigation__link').eq(1).contains(moment().add(1, 'days').format(dateFormat))
  cy.get('.moj-sub-navigation__link').eq(2).contains(moment().add(2, 'days').format(dateFormat))
})

And('I should see the following case list table', $data => {
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
    cy.get('.pac-defendant-link').eq(index).contains(string)
  })
})

Then('Display “last updated” time with a timestamp of the most recent Libra data', () => {
  const formattedDate = moment().format(dateFormat)
  cy.get('.pac-last-updated').contains(`Last updated ${formattedDate} at 08:30`)
})

And('I should see pagination text {string}', $string => {
  cy.get('.moj-pagination__results').contains($string)
})

And('I should not see the table list', () => {
  cy.get('.govuk-table').should('not.exist')
})

Then('Display “last updated” time with a timestamp of the most recent Libra data', () => {
  const formattedDate = moment().format(dateFormat)
  cy.get('.pac-last-updated').contains(`Last updated ${formattedDate} at 08:30`)
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

And('I see defendant {string}', $string => {
  cy.get('.govuk-table__body').contains('td', $string)
})

And('I should not see defendant {string}', $string => {
  cy.get('.govuk-table__body').contains('td', $string).should('not.exist')
})

And('I should see the defendant has a probation status of {string}', $string => {
  cy.get('.govuk-table__body').contains('td', $string).should('be.visible')
})

Then('I should see previously known termination date', () => {
  cy.get('[data-cy=previously-known-termination-date]').contains('Order ended 13 December 2007')
})

Then('the flag {string} appears above the defendants probation status', $string => {
  cy.get('.pac-badge').contains($string).should('exist')
})

When('I click the {string} filter button', $string => {
  cy.get('.pac-filter-button').contains($string).click()
})

When('I select the {string} filter', $string => {
  cy.get('[type="checkbox"]').check($string)
})

When('I click the {string} button', $string => {
  cy.get('button').contains($string).click()
})

When('I click the clear {string} filter tag', $string => {
  cy.get('.pac-filter__tag').contains($string).click()
})
