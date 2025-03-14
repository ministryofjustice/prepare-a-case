import { Then } from '@badeball/cypress-cucumber-preprocessor'

Then('I should see {int} previous hearings headers', $int => {
  cy.get('.app-summary-card header').should('have.length', $int)
})

Then('I click delete hearing note with id {string} on hearing {string}', ($noteId, $hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get(`#previous-note-${$noteId}`).within(() => {
      cy.get('.note-delete-link').click()
    })
  })
})

Then('I click edit hearing note with id {string} on hearing {string}', ($noteId, $hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get(`#previous-note-${$noteId}`).within(() => {
      cy.get('.note-edit-link').click()
    })
  })
})

Then('hearing note with id {string} on hearing {string} should have a textarea with a save button and cancel link', ($noteId, $hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get(`#previous-note-${$noteId}`).within(() => {
      cy.get('textarea').should('exist')
      cy.get('.hearing-note-edit-done').should('exist').and('contain.text', 'Save')
      cy.get('.note-edit-cancel-link').should('exist').and('contain.text', 'Cancel')
    })
  })
})

Then('hearing {string} should have a draft note with text {string}', ($hearingId, $draftNote) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get(`#note-box-${$hearingId}`).should('have.value', $draftNote)
  })
})

Then('I should see header on hearing {string} with outcome {string} date {string} and edit link', ($hearingId, $outcome, $date) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.app-summary-card__banner').should('contain.text', $outcome).and('contain.text', `Sent to admin on ${$date}`)
    cy.get('.hearing-outcome-edit').should('have.text', 'Edit')
  })
})

Then('I should see below notes on hearing {string} with author datetime and note with edit and delete links', ($hearingId, $data) => {
  $data.raw().forEach((dataRow, index) => {
    cy.get(`#case-progress-hearing-${$hearingId} .hearing-note-container`).eq(index).within(() => {
      const noteText = cy.get('.hearing-note-display-text')
      noteText.should('include.text', dataRow[2])
      cy.get('.hearing-note-links').should('include.text', `${dataRow[0]} on ${dataRow[1]}`)
      cy.get('.note-edit-link').should('have.text', 'Edit')
      cy.get('.note-delete-link').should('have.text', 'Delete')
    })
  })
})

Then('I should see "Send outcome to admin" button on hearing with id {string}', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.btn-send-hearing-outcome').should('exist')
  })
})


Then('I should see a warning banner on hearing {string} with text {string}', ($hearingId, $string) => {
  cy.get(`#case-progress-hearing-${$hearingId} .hearing-note-container`).eq(0).within(() => {
    cy.get('.govuk-warning-text').contains($string).should('exist');
  })
})

Then('I click Expand to add a hearing note on hearing with id {string}', ($hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-details__summary-text').click()
  })
})

Then('I should see {string} link on hearing with id {string}', ($title, $hearingId) => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-details__summary-text').should('have.text', 'Expand to add a hearing note')
  })
})

Then('I should see a text area with label Add information specific to this hearing on hearing with id {string}', $hearingId => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-details__text').within(() => {
      cy.get('label').should('contain.text', 'Add information specific to this hearing')
      cy.get('textarea').should('exist')
    })
  })
})

Then('I should see a Save button on hearing with id {string}', $hearingId => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-details__text button').should('contain.text', 'Save')
  })
})

Then('I click the Save button on hearing with id {string}', $hearingId => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-details__text button').contains('Save').click()
  })
})

Then('I should see a Cancel saving note link on hearing with id {string}', $hearingId => {
  cy.get(`#case-progress-hearing-${$hearingId}`).within(() => {
    cy.get('.govuk-details__text a').should('have.text', 'Cancel saving note')
  })
})

Then('I should see the following hearings with the hearing type label, hearing details and next appearance badge if applicable', $data => {
  $data.raw().forEach((dataRow, index) => {
    cy.get('.app-summary-card').eq(index).within(() => {
      const caseProgressCardHeader = cy.get('.app-summary-card__header > .app-summary-card__title').eq(0)
      caseProgressCardHeader.within(() => {
        cy.get('.govuk-heading-s').contains(dataRow[0])
        cy.get('.govuk-body').contains(dataRow[1])
        if (dataRow[2] === 'NEXT APPEARANCE') {
          cy.get('.pac-badge').should('exist')
        } else {
          cy.get('.pac-badge').should('not.exist')
        }
      })
      const caseProgressCardPreviousNote = cy.get('.app-summary-card__body')
      caseProgressCardPreviousNote.within(() => {
        cy.get('span').should('exist')
      })
      const caseProgressCardBody = cy.get('.app-summary-card__body').eq(0)
      caseProgressCardBody.within(() => {
        cy.get('summary > span').contains('Expand to add a hearing note')
      })
    })
  })
})

Then('I should see a bottom border on all notes within a hearing', () => {
  cy.get('.app-summary-card [data-test="note-td"]').should('have.css', 'border-bottom', '1px solid rgb(177, 180, 182)')
})

Then('I should {string} line breaks on hearing note {string}', ($expected, $noteId) => {
  expect(['see', 'not see']).to.include($expected)
  cy.get(`#previous-note-${$noteId} .hearing-note-display`).eq(0).within(() => {
    cy.get('.hearing-note-display-text').eq(0).within(() => {
      cy.get('br').should(`${$expected === 'not see' ? 'not.' : ''}exist`)
    })
  })
})