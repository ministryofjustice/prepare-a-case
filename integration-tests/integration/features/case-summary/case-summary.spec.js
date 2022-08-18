/* global cy */
import moment from 'moment'
import 'cypress-axe'
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getMonthsAndDays } from '../../../../server/routes/middleware/defaults'

And('I should see the breach badge', () => {
  cy.get('.moj-badge.moj-badge--black.pac-badge').contains('Breach').should('exist')
})

And('I should see {int} previous orders', $int => {
  cy.get('#previousOrders').within(() => {
    cy.get('tr').should('have.length', $int)
  })
})

Then('I should see the following risk register tabs', $data => {
  cy.get('.govuk-tabs').within(() => {
    $data.raw().flat().forEach((text, index) => {
      cy.get('.govuk-tabs__tab').eq(index).contains(text).should('exist')
    })
  })
})

When('I click the {string} risk tab', $string => {
  cy.get('.govuk-tabs').within(() => {
    cy.get('.govuk-tabs__tab').contains($string).click()
  })
})

And('I should see the caption text {string}', $key => {
  cy.get('.govuk-caption-m').contains($key)
})

And('I should see the correctly calculated elapsed time between {string} and {string}', ($start, $end) => {
  cy.get('.qa-elapsed-time').contains(getMonthsAndDays(moment($start, 'YYYY-MM-DD'), moment($end, 'YYYY-MM-DD').isAfter() ? moment() : moment($end, 'YYYY-MM-DD')))
})

And('I should see a straight line divide', () => {
  cy.get('.pac-key-details-bar__divider').should('exist')
})

When('I click the accordion {int} section button', $int => {
  cy.get('.govuk-accordion__section-button').eq($int - 1).click()
})

And('I should see the following attendance counts', $data => {
  $data.raw().flat().forEach((count, index) => {
    cy.get('.pac-dashboard-count').eq(index).contains(count)
  })
})

When('I click breach link {int}', $num => {
  cy.get(`.qa-breach-link-${$num}`).click()
})

And('I should see the breach banner with text {string}', $text => {
  cy.get('.moj-banner__message').contains($text)
})

And('I should not see the breach banner message', () => {
  cy.get('.moj-banner__message').should('not.exist')
})

And('I should not see the case level navigation', () => {
  cy.get('.moj-sub-navigation').should('not.exist')
})

And('If the total number of charges is greater than one', () => {
  cy.get('.govuk-accordion').should('exist')
})

Then('I should see the following list of charges in an accordion component', $data => {
  cy.get('.govuk-accordion').within(() => {
    $data.raw().flat().forEach((text, index) => {
      cy.get('.govuk-accordion__section-button').eq(index).contains(text)
    })
  })
})

Then('The accordion section {int} should expand', $int => {
  cy.get('.govuk-accordion__section-content').eq($int - 1).should('exist')
})
