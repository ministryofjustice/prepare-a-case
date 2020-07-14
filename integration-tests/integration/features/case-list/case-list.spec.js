/* global cy */
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import World from '../../world/World'

const world = new World('caseList')

And('I am viewing the {string} case list', $string => {
  world.scenario = $string
})

When('I navigate to the court list for the chosen day', () => {
  cy.visit(world.data.route)
})

And('I should see the caption with the relevant court', () => {
  cy.get('.qa-court-name').contains(world.data.court)
})

And('I should see sub navigation with default dates', () => {
  cy.get('.qa-case-list-day').eq(0).contains('Today')
  cy.get('.pac-pagination-link---text').eq(0).contains('Next day')
})

And('I should see the case list table with headings', $data => {
  function cellCheck ($row, $col, $text) {
    cy.get('.govuk-table__body > .govuk-table__row').eq($row).within(() => {
      if ($text.indexOf('*') === 0) {
        cy.get('.govuk-table__cell').eq($col).within(() => {
          cy.get('li').contains($text.substring(1))
        })
      } else {
        cy.get('.govuk-table__cell').eq($col).contains($text)
        cy.get('.govuk-table__cell').eq($col).within(() => {
          cy.get('li').should('not.exist')
        })
      }
    })
  }

  function flagCheck ($row, $col, $flag) {
    cy.get('.govuk-table__body > .govuk-table__row').eq($row).within(() => {
      cy.get('.govuk-table__cell').eq($col).within(() => {
        cy.get('.pac-badge').contains($flag).should('exist')
      })
    })
  }

  $data.raw().flat().forEach((text, index) => {
    cy.get('.govuk-table__head > .govuk-table__row').within(() => {
      cy.get('.govuk-table__header').eq(index).contains(text)
    })
  })

  world.data.list.forEach(($item, $index) => {
    cellCheck($index, 0, $item.defendant)
    cellCheck($index, 1, $item.probationStatus)
    if ($item.terminationDate) {
      cellCheck($index, 1, $item.terminationDate)
    }
    if ($item.breach) {
      flagCheck($index, 1, 'Breach')
    }
    if ($item.sso) {
      flagCheck($index, 1, 'Sso')
    }
    cellCheck($index, 2, $item.offence)
    cellCheck($index, 3, $item.listing)
    cellCheck($index, 4, $item.session)
    cellCheck($index, 5, $item.court)
    if ($item.caseNo) {
      cellCheck($index, 6, $item.caseNo)
    }
  })
})

And('The defendant names should be links', () => {
  world.data.list.forEach(({ defendant }, $index) => {
    cy.get('.pac-defendant-link').eq($index).contains(defendant)
  })
})

And('I should see a tab with text {string}', $string => {
  cy.get('.govuk-tabs__tab').contains($string)
})

And('I should see a timestamp of the most recent Libra data', () => {
  cy.get('.pac-last-updated').contains('List updated: Today at 08:30 | Next scheduled update: Tomorrow at 9:00am')
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

And('I should see a count of {string} cases', $string => {
  cy.get('.govuk-heading-m').contains($string).should('exist')
})

And('I should see medium heading with text {string}', $string => {
  cy.get('.govuk-heading-m').contains($string).should('exist')
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

And('I should see the first defendant on the {string} list', $type => {
  cy.get('.govuk-table__body > .govuk-table__row').eq(0).within(() => {
    cy.get('.govuk-table__cell').eq(0).contains(world.data[$type].name)
  })
})

And('I should only see a list of current defendants', $type => {
  cy.get('.govuk-table__body > .govuk-table__row').each($el => {
    cy.wrap($el).within(() => {
      cy.get('.govuk-table__cell').eq(1).contains('Current')
    })
  })
})

And('I should only see a list of cases in court room 1', $type => {
  cy.get('.govuk-table__body > .govuk-table__row').each($el => {
    cy.wrap($el).within(() => {
      cy.get('.govuk-table__cell').eq(5).contains('1')
    })
  })
})

And('I should only see a list of cases in the afternoon session', $type => {
  cy.get('.govuk-table__body > .govuk-table__row').each($el => {
    cy.wrap($el).within(() => {
      cy.get('.govuk-table__cell').eq(4).contains('Afternoon')
    })
  })
})

Then('I should not see the defendant on the {string} list', $type => {
  cy.get('.govuk-table__body').contains('td', world.data[$type].name).should('not.exist')
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
