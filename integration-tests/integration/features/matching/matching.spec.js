/* global cy */
import { And } from 'cypress-cucumber-preprocessor/steps'
import World from '../../world/World'

const world = new World('matching')

And('I am using the {string} match data', $string => {
  world.scenario = $string
})

And('I should see the match defendants table with headings', $data => {
  function cellCheck ($row, $col, $text, $link) {
    cy.get('.govuk-table__body > .govuk-table__row').eq($row).within(() => {
      if ($link) {
        cy.get('.pac-defendant-link').contains($text).should('exist').should('have.attr', 'href').and('include', $link)
      } else {
        cy.get('.govuk-table__cell').eq($col).contains($text)
      }
    })
  }

  $data.raw().flat().forEach((text, index) => {
    cy.get('.govuk-table__head > .govuk-table__row').within(() => {
      cy.get('.govuk-table__header').eq(index).contains(text)
    })
  })

  world.data.list.forEach(($item, $index) => {
    cellCheck($index, 0, $item.defendant)
    cellCheck($index, 1, $item.possibleMatches)
    cellCheck($index, 2, 'Review records', `/match/defendant/${$item.caseId}`)
  })
})

And('I should see the defendant record options', $data => {
  function cellCheck ($index, $row, $title, $text) {
    cy.get('fieldset').within(() => {
      cy.get('table').eq($index).within(() => {
        cy.get('.govuk-table__body > .govuk-table__row').eq($row).within(() => {
          cy.get('.govuk-table__header').eq(0).contains($title)
          cy.get('.govuk-table__cell').eq(0).should('exist')
          if ($text !== '') {
            cy.get('.govuk-table__cell').eq(0).contains($text)
          }
        })
      })
    })
  }

  world.data.list.forEach(($item, $index) => {
    cellCheck($index, 0, 'Name', $item.name)
    cellCheck($index, 1, 'DOB', $item.dob)
    cellCheck($index, 2, 'Address', $item.address)
    cellCheck($index, 3, 'CRN', $item.crn)
    cellCheck($index, 4, 'PNC', $item.pnc)
    cellCheck($index, 5, 'Probation status', $item.probationStatus)
    cellCheck($index, 6, 'Most recent event', $item.mostRecentEvent)
  })
})

And('I should see the match linked banner message', () => {
  cy.get('.moj-banner__message').contains(`You have successfully linked an nDelius record to ${world.data.defendantName}.`)
})

And('I should see the match unlinked banner message', () => {
  cy.get('.moj-banner__message').contains(`You have successfully unlinked an nDelius record from ${world.data.defendantName}.`)
})

And('I should see the match confirmation banner message', () => {
  cy.get('.moj-banner__message').contains(`You have successfully confirmed a record for ${world.data.defendantName}.`)
})

And('I should see the no record match confirmation banner message', () => {
  cy.get('.moj-banner__message').contains(`You have successfully confirmed ${world.data.defendantName} has no nDelius record.`)
})

And('I should see the match error banner message', () => {
  cy.get('.moj-banner__message').contains('Something went wrong - try again.')
})

And('I should see the following matched text', $data => {
  $data.raw().flat().forEach((text, index) => {
    cy.get('mark').eq(index).contains(text)
  })
})
