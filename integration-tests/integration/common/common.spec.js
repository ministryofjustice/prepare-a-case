/* global cy */
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import 'cypress-axe'

Given('I am a registered user', () => {
  // @TODO: Implement registered user test
})

When('I open the application', () => {
  cy.visit('/')
})

When('I navigate to the {string} route', $route => {
  cy.visit(`${$route}`)
})

When('I view the court list', () => {
  cy.visit('cases')
})

Then('I should be on the {string} page', $title => {
  cy.get('title').contains(`${$title} - `)
})

And('I should see the heading {string}', $title => {
  cy.get('h1').contains($title)
})

And('I should see the level 2 heading {string}', $title => {
  cy.get('h2').contains($title)
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
  cy.get('.govuk-link').contains($string).click()
})

And('I click the {string} button', $string => {
  cy.get('button').contains($string).click()
})
