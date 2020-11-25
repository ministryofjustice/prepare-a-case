/* global cy */
import { Before, And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import 'cypress-axe'
import moment from 'moment'

Before(() => {
  cy.task('stubLogin')
  cy.login()
})

Given('I am an authenticated user', () => {
  cy.get('#loginForm').should('not.exist')
})

When('I open the application', () => {
  cy.visit('/')
})

When('I navigate to the {string} route', $route => {
  cy.visit(`/B14LO00/${$route}`, { failOnStatusCode: false })
})

When('I navigate to the {string} route for today', $route => {
  cy.visit(`/B14LO00/${$route}/${moment().format('YYYY-MM-DD')}`)
})

And('I should see the caption with the court name {string}', $string => {
  cy.get('.qa-court-name').contains($string)
})

When('I view the court list', () => {
  cy.visit('/B14LO00/cases')
})

Then('I should be on the {string} page', $title => {
  cy.get('title').contains(`${$title} - `)
})

And('I should see the medium heading {string}', $string => {
  cy.get('.govuk-heading-m').contains($string)
})

And('I should see the heading {string}', $title => {
  cy.get('h1').contains($title)
})

And('I should see the level 2 heading {string}', $title => {
  cy.get('h2').contains($title)
})

And('I should see the level 3 heading {string}', $title => {
  cy.get('h3').contains($title)
})

And('I should see the following level 2 headings', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('h2').eq(index).contains(text)
  })
})

And('I should see the following level 3 headings', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('h3').eq(index).contains(text)
  })
})

And('I should see the following table headings', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.govuk-table__header').eq(index).contains(text)
  })
})

And('I should see the following table {int} headings', ($index, $data) => {
  cy.get('.govuk-table').eq($index - 1).within(() => {
    $data.raw()[0].forEach((text, index) => {
      cy.get('.govuk-table__header').eq(index).contains(text)
    })
  })
})

And('I should see the following table rows', $data => {
  $data.raw().forEach((row, index) => {
    cy.get('.govuk-table__body > .govuk-table__row').eq(index).within(() => {
      row.forEach((text, colIndex) => {
        cy.get('.govuk-table__cell').eq(colIndex).contains(text)
      })
    })
  })
})

And('I should see the following table {int} rows', ($int, $data) => {
  cy.get('.govuk-table').eq($int - 1).within(() => {
    $data.raw().forEach((row, index) => {
      cy.get('.govuk-table__body > .govuk-table__row').eq(index).within(() => {
        row.forEach((text, colIndex) => {
          if (text !== '') {
            cy.get('.govuk-table__cell').eq(colIndex).contains(text)
          }
        })
      })
    })
  })
})

And('I should logout', () => {
  cy.get('.moj-header__navigation-link').click()
})

And('I should not see the heading level {int} with text {string}', ($level, $text) => {
  cy.get(`h${$level}`).contains($text).should('not.exist')
})

And('I should see the caption {string}', $caption => {
  cy.get('.govuk-caption-xl').contains($caption)
})

And('There should be no a11y violations', () => {
  cy.injectAxe()
  cy.checkA11y('main#main-content')
})

And('I should see the body text {string}', $text => {
  cy.get('.govuk-body').contains($text)
})

And('I should see the text {string} within element with class {string}', ($text, $class) => {
  cy.get(`.${$class}`).contains($text)
})

And('I should see the following elements with {string} class text', ($class, $data) => {
  $data.raw()[0].forEach((text, index) => {
    cy.get(`.${$class}`).eq(index).contains(text)
  })
})

And('I should see the hint text {string}', $text => {
  cy.get('.govuk-hint').contains($text)
})

And('I should see the body text {string} in bold', $text => {
  cy.get('.govuk-body').contains($text).should('exist').should('have.attr', 'class').and('include', 'govuk-!-font-weight-bold')
})

And('I should see the caption text {string}', $text => {
  cy.get('.govuk-caption-m').contains($text)
})

And('I should see link {string} in position {int} with href {string}', ($string, $int, $href) => {
  cy.get('.govuk-link').eq($int - 1).contains($string).should('exist').should('have.attr', 'href').and('include', $href)
})

And('I should see link {string} with href {string}', ($string, $href) => {
  cy.get('.govuk-link').contains($string).should('exist').should('have.attr', 'href').and('include', $href)
})

And('I should see sub navigation with the following links', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.moj-sub-navigation__link').eq(index).contains(text)
  })
})

When('I click the sub navigation with {string} text', $string => {
  cy.get('.moj-sub-navigation__link').contains($string).click()
})

When('I click the {string} link', $string => {
  cy.get($string === 'Back' ? '.govuk-back-link' : '.govuk-link').contains($string).click()
})

And('I click the {string} button', $string => {
  cy.get('button').contains($string).click()
})

And('I should see a button with the label {string}', $string => {
  cy.get('button').contains($string).should('exist')
})

And('I should not see a button with the label {string}', $string => {
  cy.get('button').contains($string).should('not.exist')
})

And('I should see the legend {string}', $string => {
  cy.get('legend').contains($string)
})

And('I should see the inset text {string}', $string => {
  cy.get('.govuk-inset-text').contains($string)
})

And('I should see radio buttons with the following IDs', $data => {
  $data.raw()[0].forEach((id, index) => {
    cy.get('input[type=radio]').eq(index).should('exist').should('have.attr', 'id').and('include', id)
  })
})

And('I click the element with id {string}', $id => {
  cy.get(`#${$id}`).click()
})

And('I click the {string} summary link', $string => {
  cy.get('.govuk-details__summary').contains($string).click()
})

And('I should see the error message {string}', $string => {
  cy.get('.govuk-error-summary').should('exist')
  cy.get('.govuk-error-summary').within(() => {
    cy.get('.govuk-error-summary__list').contains($string)
  })
  cy.get('.govuk-error-message').contains($string)
})

And('I should see the following summary list {int} with keys', ($int, $data) => {
  cy.get('.govuk-summary-list').eq($int - 1).within(() => {
    $data.raw()[0].forEach((text, index) => {
      cy.get('.govuk-summary-list__key').eq(index).contains(text)
    })
  })
})

And('I should see the text input label {string}', $string => {
  cy.get('label').contains($string).should('exist')
})

And('I should see the text input with id {string}', $id => {
  cy.get('input[type=text]').should('exist').should('have.attr', 'id').and('include', $id)
})

And('I should see the text input hint {string}', $string => {
  cy.get('.govuk-hint').contains($string).should('exist')
})

And('I enter {string} into text input with id {string}', ($string, $id) => {
  cy.get(`#${$id}`).type($string)
})
