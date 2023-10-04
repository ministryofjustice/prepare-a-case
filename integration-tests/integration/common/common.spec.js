/* global cy expect */
import { Before, And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import 'cypress-axe'
import moment from 'moment'

const shortDateFormat = 'YYYY-MM-DD'
const longDateFormat = 'dddd D MMMM'
const displayDateFormat = 'D MMM YYYY'

// to log a11y violations
function terminalLog (violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length
    })
  )

  cy.task('table', violationData)
}

function correctDates ($string) {
  if ($string.includes('$TODAY')) {
    $string = $string.replace('$TODAY', moment().format(shortDateFormat))
  }
  if ($string.includes('$LONG_TODAY')) {
    $string = $string.replace('$LONG_TODAY', moment().format(longDateFormat))
  }
  if ($string.includes('$END_TODAY')) {
    $string = $string.replace('$END_TODAY', moment().format(displayDateFormat))
  }
  if ($string.includes('$TOMORROW')) {
    $string = $string.replace('$TOMORROW', moment().add(1, 'days').format(shortDateFormat))
  }
  if ($string.includes('$END_TOMORROW')) {
    $string = $string.replace('$END_TOMORROW', moment().add(1, 'days').format(displayDateFormat))
  }
  if ($string.includes('$ONE_YEAR_AGO')) {
    $string = $string.replace('$ONE_YEAR_AGO', moment().add(-1, 'years').format(displayDateFormat))
  }
  if ($string.includes('$SIX_MONTHS_AGO')) {
    $string = $string.replace('$SIX_MONTHS_AGO', moment().add(-6, 'months').format(displayDateFormat))
  }
  if ($string.includes('$ONE_MONTHS_TIME')) {
    $string = $string.replace('$ONE_MONTHS_TIME', moment().add(1, 'months').format(displayDateFormat))
  }
  if ($string.includes('$THREE_MONTHS_TIME')) {
    $string = $string.replace('$THREE_MONTHS_TIME', moment().add(3, 'months').format(displayDateFormat))
  }
  if ($string.includes('$SIX_MONTHS_TIME')) {
    $string = $string.replace('$SIX_MONTHS_TIME', moment().add(6, 'months').format(displayDateFormat))
  }
  if ($string.includes('$FIVE_MONTHS_TIME')) {
    $string = $string.replace('$FIVE_MONTHS_TIME', moment().add(5, 'months').format(displayDateFormat))
  }
  return $string
}

Before(() => {
  cy.task('stubLogin')
  cy.login()
})

Given('I am an authenticated user', () => {
  cy.get('#loginForm').should('not.exist')
})

Then('I should see the URL with {string}', $string => {
  cy.url().should('include', $string)
})

Then('I should not see the cookie banner', () => {
  cy.get('.govuk-cookie-banner').should('not.exist')
})

When('I open the application', () => {
  cy.visit('/')
})

When('I navigate to the {string} route', $route => {
  cy.visit(`/B14LO/${$route}`, { failOnStatusCode: false })
})

When('I navigate to the {string} route for today', $route => {
  cy.visit(`/B14LO/${$route}/${moment().format('YYYY-MM-DD')}`)
})

When('I navigate to the {string} base route', $route => {
  cy.visit($route)
})

When('I navigate to the {string} base route for today', $route => {
  cy.visit(`${$route}/${moment().format('YYYY-MM-DD')}`)
})

And('I should see the phase banner', () => {
  cy.get('.govuk-phase-banner').should('exist')
})

And('I should see the Possible NDelius record badge', () => {
  cy.get('.moj-badge--red').should('exist')
})

And('I should see an iframe with src {string}', ($string) => {
  cy.get('iframe').should('have.attr', 'src').and('include', $string)
})

And('I should see the tag {string}', $string => {
  cy.get('.govuk-tag').contains($string).should('exist')
})

And('I should see phase banner link {string} with href {string}', ($string, $href) => {
  cy.get('.govuk-phase-banner').within(() => {
    cy.get('.govuk-link').contains($string).should('exist').should('have.attr', 'href').and('include', $href)
  })
})

And('I should see the caption with the court name {string}', $string => {
  cy.get('.qa-court-name').contains($string)
})

Then('I should be on the {string} page', $title => {
  cy.get('title').contains(`${$title} - `)
})

And('I should see medium heading with text {string}', $string => {
  cy.get('.govuk-heading-m').contains($string).should('exist')
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
        const safeText = text.split(' ').map(part => {
          if (part.includes('{')) {
            cy.get('.govuk-table__cell').eq(colIndex).within(() => {
              cy.get('.pac-badge').contains(part.replace(/{|}|/g, '')).should('exist')
            })
            return undefined
          } else {
            return part
          }
        })
        const checkText = safeText.join(' ').trim()
        if (checkText !== '') {
          cy.get('.govuk-table__cell').eq(colIndex).contains(correctDates(checkText).replaceAll(' \n ', ''))
        }
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
  cy.checkA11y('main#main-content', null, terminalLog)
})

And('I should see the body text {string}', $text => {
  cy.get('.govuk-body').contains(correctDates($text))
})

And('I should see the text {string} within element with class {string}', ($text, $class) => {
  cy.get(`.${$class}`).contains(correctDates($text))
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

And('Link with text {string} should not be visible', ($string) => {
  cy.get('.govuk-link').contains($string).should('not.be.visible')
})

And('I should see footer link {string} with href {string}', ($string, $href) => {
  cy.get('.govuk-footer__link').contains($string).should('exist').should('have.attr', 'href').and('include', $href)
})

And('I should see back link {string} with href {string}', ($string, $href) => {
  cy.get('.govuk-back-link').contains($string).should('exist').should('have.attr', 'href').and('include', correctDates($href))
})

And('I should see sub navigation with the following links', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.moj-sub-navigation__link').eq(index).contains(text)
  })
})

When('I switch to mobile view', () => {
  cy.viewport('iphone-x')
})

When('I click the sub navigation with {string} text', $string => {
  cy.get('.moj-sub-navigation__link').contains($string).click()
})

When('I click the {string} link', $string => {
  cy.get($string === 'Back' ? '.govuk-back-link' : '.govuk-link').contains($string).click()
})

When('I click the {string} header navigation link', $string => {
  cy.get('.moj-header__navigation-link').contains($string).click()
})

When('I click the {string} button', $string => {
  cy.get('.govuk-button').contains($string).click()
})

And('I should see a button with the label {string}', $string => {
  cy.get('.govuk-button').contains($string).should('exist')
})

And('I should see a link with text Cancel to cancel a draft comment', () => {
  cy.get('#caseComments').within(() => {
    cy.get('.comment-draft-cancel-link').contains('Cancel').should('exist')
  })
})

And('I should not see a button with the label {string}', $string => {
  cy.get('.govuk-button').contains($string).should('not.exist')
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

And('I should see the following summary list text {string}', $string => {
  cy.get('.govuk-summary-list').contains($string).should('exist')
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

And('I should see the text {string} in a table cell', $string => {
  cy.get('.govuk-table__cell').contains($string).should('exist')
})

And('I should see the link {string} in a table row', $string => {
  cy.get('.govuk-table__row').within(() => {
    cy.get('.govuk-link').contains($string).should('exist')
  })
})

And('I should see the text {string} in a list', $string => {
  cy.get('.govuk-list').contains($string).should('exist')
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

And('I enter invalid search term into search input and click search then I should see appropriate error', ($data) => {
  let $searchTerm, $expectedError
  $data.raw().forEach((row) => {
    $searchTerm = row[0].trim() === 'EMPTY' ? '' : row[0]
    $expectedError = row[1]

    cy.get('#search-term').type($searchTerm)
    cy.get('.govuk-button').contains('Search').click()
    cy.get('.govuk-error-summary').within(() => {
      cy.get('h2').should('contain.text', 'There is a problem')
      cy.get('a').should('have.text', $expectedError)
    })
    cy.get('.govuk-form-group--error .govuk-error-message').should('contain.text', `Error:${$expectedError}`)
  })
})

When('I enter search term {string} into search input and click search then I should see error {string}', ($searchTerm, $expectedError) => {
  cy.get('#search-term').clear()
  cy.get('#search-term').type($searchTerm)
  cy.get('.govuk-button').contains('Search').click()

  if ($expectedError === 'NO_ERROR') {
    cy.get('.govuk-error-summary').should('not.exist')
    cy.get('.govuk-form-group--error .govuk-error-message').should('not.exist')
  } else {
    cy.get('.govuk-error-summary').within(() => {
      cy.get('h2').should('contain.text', 'There is a problem')
      cy.get('a').should('have.text', $expectedError)
    })
    cy.get('.govuk-form-group--error .govuk-error-message').should('contain.text', `Error:${$expectedError}`)
  }
})

And('I see value {string} in the text input with id {string}', ($string, $id) => {
  cy.get(`#${$id}`).should('contain.value', $string)
})

And('I should see 5 numbered pagination links from {int} to {int} followed by a link Next', ($fromNum, $toNum) => {
  const nav = cy.get('.moj-pagination .moj-pagination__list')

  for (let i = $fromNum; i <= $toNum; i++) {
    nav.within(() => {
      cy.get('.moj-pagination__item').contains(`${i}`).should('exist')
    })
  }
  cy.get('.moj-pagination__item').contains('Next').should('exist')
})

And('I should see the pagination numbers {int} to {int} of {int} results', ($fromNum, $toNum, $ofNum) => {
  cy.get('.moj-pagination__results').should('contain.text', `Showing ${$fromNum} to ${$toNum} of ${$ofNum} results`)
})

And('I click the "Next" link in the pagination links', () => {
  cy.get('.moj-pagination .moj-pagination__list .moj-pagination__item').contains('Next').click()
})

Then('the page {int} should be loaded', ($pageNo) => {
  cy.location().should(location => {
    const urlParams = new URLSearchParams(location.href)
    expect(urlParams.get('page')).eq(`${$pageNo}`)
  })
})

And('I should not see the key details banner', () => {
  cy.get('.pac-key-details-bar').should('not.exist')
})

And('I should not see the {string} link', $string => {
  cy.get('.govuk-link').contains($string).should('not.exist')
})

And('I should see the key details banner', () => {
  cy.get('.pac-key-details-bar').should('exist')
})

When('I enter the text {string} into the {string} input and press ENTER', ($text, $id) => {
  cy.get(`#${$id}`).type($text).type('{enter}').blur()
})

And('I should see the success banner message {string}', $string => {
  cy.get('.moj-banner--success').contains($string).should('exist')
})

And('I should see a textarea with id {string}', $id => {
  cy.get(`#${$id}`).should('exist')
})

And('I should see a textarea with id {string}', $comment => {
  cy.get(`#${$comment}`).should('exist')
})

And('I should see a count of {string}', $string => {
  cy.get('.govuk-heading-m').contains(`${$string}`).should('exist')
})

And('I should see the following summary list', $data => {
  cy.get('.govuk-summary-list').within(() => {
    $data.raw().forEach((text, index) => {
      cy.get(index % 2 === 0 ? '.govuk-summary-list__key' : '.govuk-summary-list__value').eq(index).contains(text[index % 2])
    })
  })
})

And('I should see govuk notification banner with header {string} and message {string}', ($header, $message) => {
  const govukNotificationBanner = cy.get('.govuk-notification-banner')
  govukNotificationBanner.should('exist')
  govukNotificationBanner.within(() => {
    cy.get('.govuk-notification-banner__header > h2').contains($header)
    cy.get('.govuk-notification-banner__content').contains($message)
  })
})

And('I should not see govuk notification banner', () => {
  cy.get('.govuk-notification-banner').should('not.exist')
})

And('I should see the Primary navigation', () => {
  cy.get('.moj-primary-navigation').should('exist')
})

And('I should see the Primary navigation {string} link', $string => {
  cy.get('.moj-primary-navigation').within(() => {
    cy.get('.moj-primary-navigation__link').contains($string)
  })
})

When('I click on the {string} link in the Primary navigation', $string => {
  cy.get('.moj-primary-navigation').within(() => {
    cy.get('.moj-primary-navigation__link').contains($string).click()
  })
})

And('the page should produce a 404 error', () => {
  cy.get('h1').should('have.text', 'Page not found')
})

And('I should see a tab with text {string}', $string => {
  cy.get('.govuk-tabs__tab').contains($string)
})

And('I should see the breach badge', () => {
  cy.get('.moj-badge.moj-badge--black.pac-badge').contains('Breach').should('exist')
})

And('I should not see the {string} filter', $string => {
  cy.get('.pac-filter-button').contains($string).should('not.exist')
})

And('I should see the {string} query have the value {string}', ($string, $value) => {
  cy.location('search').then(query => {
    const urlParams = new URLSearchParams(query)
    expect(urlParams.get($string)).eq($value)
  })
})

// common pac filter panel specs

When('I click the {string} filter button', $string => {
  cy.get('.pac-filter-button').contains($string).click()
})

When('I select the {string} filter', $string => {
  cy.get(`input[data-test="${$string}"]`).invoke('attr', 'checked', true)
})

When('I click the clear {string} filter tag', $string => {
  cy.get('.pac-filter__tag').contains($string).click()
})

When('I click the {string} sort button', $string => {
  cy.get('.pac-sort-button').contains($string).click()
})

And('I should see the {string} filter tag', $string => {
  cy.get('.pac-filter__tag').contains($string)
})

// Modals

And('I should {string} the {string} modal popup to assign hearing outcome', ($expected, $id) => {
  const expected = $expected.toLowerCase()
  expect(['see', 'not see']).to.include(expected)
  cy.get(`[data-cy=${$id}]`).should(`${expected === 'not see' ? 'not.' : ''}be.visible`)
})

And('the {string} modal popup should have the close button', ($id) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('button').contains('X').should('exist')
  })
})

When('I click button {string} on {string} modal popup', ($buttonText, $id) => {
  cy.get(`#${$id} button`).contains($buttonText).click()
})

And('I should see the link {string} {string} open a reassign modal', ($string, $expected) => {
  const expected = $expected.toLowerCase()
  expect(['will', 'will not']).to.include(expected)

  cy.get('.govuk-table__row').within(() => {
    cy.get('.govuk-link').contains($string).should('have.attr', 'class')
      .and(`${expected === 'will not' ? 'not.' : ''}contain`, 'pac-reassign')
  })
})

And('the {string} modal popup should have text heading {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('h2').contains($string).should('be.visible')
  })
})

And('the {string} modal popup should have text paragraph {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('p').contains($string).should('be.visible')
  })
})

And('the {string} modal popup should have the button {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('button').contains($string).should('exist')
  })
})

And('the {string} modal popup should have the link {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('a').contains($string).should('exist')
  })
})

And('the {string} modal popup should have the link {string}', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('a').contains($string).should('exist')
  })
})

When('I click the {string} modal {string} link', ($id, $string) => {
  cy.get(`[data-cy=${$id}]`).within(() => {
    cy.get('.govuk-link').contains($string).click()
  })
})
