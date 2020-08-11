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

  console.log('DATA:', world.data)

  world.data.list.forEach(($item, $index) => {
    cellCheck($index, 0, $item.defendant)
    cellCheck($index, 1, $item.possibleMatches)
    cellCheck($index, 2, 'Review records', `/match/defendant/${$item.caseId}`)
  })
})
