/* global cy */
import moment from 'moment'
import 'cypress-axe'
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { getMonthsAndDays } from '../../../../server/routes/middleware/defaults'

const displayDateFormat = 'D MMM YYYY'

And('I should see the caption with the relevant court', () => {
  cy.get('.qa-court-name').contains('Sheffield Magistrates\' Court')
})

And('I should see Back to cases link with href of case list date', () => {
  cy.get('.govuk-back-link').contains('Back to cases').should('exist').should('have.attr', 'href').and('include', `${moment().format('YYYY-MM-DD')}`)
})

And('I should see Back to cases link with href of case list date and page', () => {
  cy.get('.govuk-back-link')
    .contains('Back to cases')
    .should('exist')
    .should('have.attr', 'href')
    .and('include', `${moment().format('YYYY-MM-DD')}`)
    .and('include', 'page=1')
})

When('I navigate to the case summary route for case number {string}', $caseNo => {
  cy.visit(`/B14LO00/case/${$caseNo}/summary`)
})

When('I navigate to the probation record route for case number {string}', $caseNo => {
  cy.visit(`/B14LO00/case/${$caseNo}/record`)
})

When('I click the first {string} order link', $type => {
  cy.get('.govuk-link').contains($type === 'current' ? 'ORA Community Order (18 Months)' : 'CJA - Std Determinate Custody').eq(0).click()
})

When('I navigate to the current order which is currently on licence', $type => {
  cy.visit('/B14LO00/case/668911253/record/1309234876')
})

And('I should see the correct licence header details', () => {
  cy.get('.qa-start-title').contains('Post-release status')
  cy.get('.qa-end-title').contains('Licence started')
  cy.get('.qa-elapsed-title').contains('Licence ends')

  cy.get('.qa-start-date').contains('On licence')
  cy.get('.qa-end-date').contains(moment().add(-6, 'months').format(displayDateFormat))
  cy.get('.qa-elapsed-time').contains(moment().add(6, 'months').format(displayDateFormat))
})

When('I navigate to the current order which is currently on PSS', $type => {
  cy.visit('/B14LO00/case/668911253/record/2360414697')
})

And('I should see the correct PSS header details', () => {
  cy.get('.qa-start-title').contains('Post-release status')
  cy.get('.qa-end-title').contains('PSS started')
  cy.get('.qa-elapsed-title').contains('PSS ends')

  cy.get('.qa-start-date').contains('On post-sentence supervision (PSS)')
  cy.get('.qa-end-date').contains(moment().format(displayDateFormat))
  cy.get('.qa-elapsed-time').contains(moment().add(5, 'months').format(displayDateFormat))
})

Then('I should see the offender current order count', () => {
  cy.get('h2').contains('Current orders (3)')
})

And('I should see a link {string} to href {string}', ($link, $href) => {
  cy.get('.govuk-link').contains($link).should('exist')
    .should('have.attr', 'href')
    .and('include', $href)
})

And('I should see the breach badge', () => {
  cy.get('.moj-badge.moj-badge--black.pac-badge').contains('Breach').should('exist')
})

And('I should see the current order offence', () => {
  cy.get('.govuk-body').contains('Stealing mail bags or postal packets or unlawfully taking away or opening mail bag - 04200')
})

And('I should see the current order start date', () => {
  const startDate = moment('2019-05-20').format('DD MMMM YYYY')
  cy.get('.govuk-hint').contains(`Started on ${startDate}`)
})

And('I should see the requirements for the first current order', () => {
  cy.get('.qa-current-requirements-0').contains('Unpaid Work (Regular) – 60 Hours')
})

And('I should see the licence conditions for the second current order', () => {
  cy.get('.qa-current-licence-conditions-1').contains('Curfew Arrangement')
})

And('I should see the pss requirements for the third current order', () => {
  cy.get('.qa-current-pss-requirements-2').contains('Curfew Arrangement')
})

And('I should see the offender previous order count of {string}', $text => {
  cy.get('h2').contains(`Previous orders (${$text})`)
})

And('I should see link to the first previous order', () => {
  cy.get('.qa-previous-order-1').within(() => {
    cy.get('.govuk-link').contains('CJA - Std Determinate Custody').should('exist')
      .should('have.attr', 'href')
      .and('include', 'record/636401162')
  })
})

And('I should see a limited number of previous orders', () => {
  cy.get('#previousOrders').within(() => {
    cy.get('tr').should('have.length', 5)
  })
})

And('I should see all previous orders', () => {
  cy.get('#previousOrders').within(() => {
    cy.get('tr').should('have.length', 11)
  })
})

And('I should see the previous order offence', () => {
  cy.get('.qa-previous-order-1-offence').contains('Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801')
})

And('I should see the previous order end date', () => {
  cy.get('.qa-previous-order-1-end-date').contains(`Ended on ${moment('2018-01-23', 'YYYY-MM-DD').format(displayDateFormat)}`)
})

And('I should see the unpaid work information for {string} defendant', ($text) => {
  cy.get('.qa-upw-status').contains($text === 'currentWithBreach' ? 'Terminated - 1 Apr 2020' : 'Terminated - 23 Jan 2018')
  cy.get('.qa-upw-ordered').contains($text === 'currentWithBreach' ? 32 : 12)
  cy.get('.qa-upw-worked').contains($text === 'currentWithBreach' ? 30 : 2)

  if ($text === 'current') {
    cy.get('.qa-upw-appointments').contains(2)
    cy.get('.qa-upw-attended').contains(2)
    cy.get('.qa-upw-acceptable').contains(0)
  }
})

And('I should see the offender manager name {string}', ($text) => {
  cy.get('.govuk-grid-column-one-third').within(() => {
    cy.get('.govuk-body').contains($text)
  })
})

And('I should see the offender manager was allocated on {string}', ($text) => {
  cy.get('.govuk-grid-column-one-third').within(() => {
    cy.get('.govuk-hint').contains(`Allocated on ${$text}`)
  })
})

And('I should see the last pre-sentence report details for {string} defendant', $text => {
  cy.get('.govuk-grid-column-one-third').within(() => {
    if ($text === 'current') {
      cy.get('.govuk-heading-m').contains('Last pre-sentence report')
      cy.get('.govuk-body').contains('Pre-Sentence Report - Fast')
      cy.get('.govuk-hint').contains('Delivered more than 6 months ago')
    } else if ($text === 'previouslyKnown') {
      cy.get('.govuk-heading-m').contains('Last pre-sentence report')
      cy.get('.govuk-body').contains('Pre-Sentence Report - Fast')
      cy.get('.govuk-hint').contains(`Delivered 1 month ago (${moment().add(-1, 'months').format('D MMM YYYY')})`)
    } else {
      cy.get('.govuk-heading-m').contains('Last pre-sentence report')
      cy.get('.govuk-body').contains('Pre-Sentence Report - Fast')
      cy.get('.govuk-hint').contains(`Delivered less than 1 month ago (${moment().add(-5, 'days').format('D MMM YYYY')})`)
    }
  })
})

And('I should see the last OASys assessment details', () => {
  cy.get('.govuk-grid-column-one-third').within(() => {
    cy.get('.govuk-heading-m').contains('Last OASys assessment')
    cy.get('.govuk-body').contains('OASys Assessment Layer 3')
    cy.get('.govuk-hint').contains('Completed on 20 Jun 2018')
  })
})

And('I should see the {string} summary table', ($position, $data) => {
  $data.raw().forEach((row, index) => {
    row.forEach((text, index2) => {
      cy.get(`${$position === 'first' ? '.govuk-table' : '.govuk-table ~ .govuk-table'} > .govuk-table__body > .govuk-table__row`).within(() => {
        cy.get(index2 % 2 === 0 ? '.govuk-table__header' : '.govuk-table__cell').eq(index).contains(text)
      })
    })
  })
})

Then('I should see a summary list', ($data) => {
  cy.get('.govuk-summary-list').should('exist')
})

Then('I click the defendant name {string} link', ($title) => {
  cy.get('.govuk-link').contains($title).click()
})

Then('I click the active risk tab', () => {
  cy.get('.pac-active').contains('Active').click()
})

Then('I click the inactive risk tab', () => {
  cy.get('.pac-inactive').contains('Inactive').click()
})

Then('I should see the risk register table', () => {
  cy.get('.govuk-tabs').should('exist')
})

Then('I should see the active registration count for {string} defendant', $type => {
  cy.get('.govuk-tabs__tab').contains($type === 'current' ? 'Active (0)' : 'Active (4)')
})

Then('I should see the inactive registration count for {string} defendant', $type => {
  cy.get('.govuk-tabs__tab').contains($type === 'current' ? 'Inactive (0)' : 'Inactive (1)')
})

Then('I should see the heading has the defendant name {string}', ($text) => {
  cy.get('h1').contains($text)
})

And('I should see the body text with the defendant offence {string} in bold', $key => {
  cy.get('.govuk-body').contains($key).should('exist').should('have.attr', 'class').and('include', 'govuk-!-font-weight-bold')
})

And('I should see the caption text {string}', $key => {
  cy.get('.govuk-caption-m').contains($key)
})

And('I should see the level 2 heading with the {string} order title', $type => {
  cy.get('h2').contains($type === 'current' ? 'ORA Community Order (18 Months)' : 'CJA - Std Determinate Custody')
})

And('I should see the correct start, end and elapsed time headings', () => {
  cy.get('.qa-start-title').contains('Started')
  cy.get('.qa-end-title').contains('Ends')
  cy.get('.qa-elapsed-title').contains('Time elapsed')
})

And('I should see the correct start, ended and reason headings', () => {
  cy.get('.qa-start-title').contains('Started')
  cy.get('.qa-end-title').contains('Ended')
  cy.get('.qa-elapsed-title').contains('Reason')
})

And('I should see the {string} order start and end dates', $type => {
  if ($type === 'current') {
    cy.get('.qa-start-date').contains(moment('2019-05-20').format(displayDateFormat))
    cy.get('.qa-end-date').contains(moment('2020-05-25').format(displayDateFormat))
  } else if ($type === 'previous') {
    cy.get('.qa-start-date').contains(moment('2017-03-08').format(displayDateFormat))
    cy.get('.qa-end-date').contains(moment('2018-01-23').format(displayDateFormat))
  } else {
    cy.get('.qa-start-date').contains(moment('2018-10-07').format(displayDateFormat))
    cy.get('.qa-end-date').contains(moment('2020-06-17').format(displayDateFormat))
  }
})

And('I should see the correctly calculated elapsed time for the current order for {string} defendant', $type => {
  if ($type === 'current') {
    cy.get('.qa-elapsed-time').contains(getMonthsAndDays(moment('2019-05-20', 'YYYY-MM-DD'), moment('2020-05-25', 'YYYY-MM-DD').isAfter() ? moment() : moment('2020-05-25', 'YYYY-MM-DD')))
  } else {
    cy.get('.qa-elapsed-time').contains(getMonthsAndDays(moment('2018-10-07', 'YYYY-MM-DD'), moment('2020-06-17', 'YYYY-MM-DD').isAfter() ? moment() : moment('2020-06-17', 'YYYY-MM-DD')))
  }
})

And('I should see the termination date of the previous order and the reason for terminating', $type => {
  cy.get('.qa-elapsed-time').contains('ICMS Miscellaneous Event')
})

And('I should see the row with the key {string}', $title => {
  cy.get('.govuk-summary-list__key').contains($title)
})

And('I should see the value {string}', $title => {
  cy.get('.govuk-summary-list__value').contains($title)
})

And('I should see a straight line divide', () => {
  cy.get('.pac-key-details-bar__divider').should('exist')
})

And('I should see court room {string}, {string} session and the {string} listing', ($court, $session, $listing) => {
  const date = moment().format('dddd D MMMM')
  cy.get('.govuk-body').contains(`Court ${$court}, ${$session} session, ${date} (${$listing} listing).`)
})

And('I should see order breach information', () => {
  cy.get('.qa-breaches').within(() => {
    cy.get('tr').within(() => {
      cy.get('td').eq(0).contains('Community Order/SSO Breach')
      cy.get('td').eq(1).contains('In progress')
      cy.get('td').eq(2).contains('30 Dec 2014')
    })
  })
})

When('I click the first charge accordion button', () => {
  cy.get('.govuk-accordion__section-button').eq(0).click()
})

And('I should see the appointment attendance information for {string} defendant', $type => {
  const count = [10, 6, 2, 2, 1, 1, 0, 1, 1, 3, 3, 0]
  const countBreach = [57, 25, 9, 7, 5, 4, 6, 2, 2, 2, 11, 3, 3, 3, 2, 15, 5, 4, 3, 3, 0]
  const headings = ['Appointments to date', 'Acceptable', 'Unacceptable', 'Awaiting outcome']
  const types = ['Planned office visit', 'Unpaid work', 'Appointment with External Agency', 'IAPS / Accredited programme']

  if ($type === 'currentWithBreach') {
    countBreach.forEach(($text, $index) => {
      cy.get('.pac-dashboard-count').eq($index).contains($text)
    })
  } else {
    count.forEach(($text, $index) => {
      cy.get('.pac-dashboard-count').eq($index).contains($text)
    })
  }

  headings.forEach($text => {
    cy.get('h3').contains($text)
  })
  types.forEach($text => {
    cy.get('.govuk-body').contains($text)
  })
})

When('I click breach link {int}', $num => {
  cy.get(`.qa-breach-link-${$num}`).click()
})

Then('I should see the correct breach heading', () => {
  cy.get('h2').contains('Community Order/SSO Breach').should('exist')
})

And('I should see the correct breach banner for status {string}', ($text) => {
  if ($text.includes('Warrant') || $text.includes('Summons')) {
    cy.get('.moj-banner__message').contains('This breach is ready to prosecute')
  } else if ($text.includes('Proven') || $text.includes('Withdrawn') || $text.includes('Completed')) {
    cy.get('.moj-banner__message').should('not.exist')
  } else {
    cy.get('.moj-banner__message').contains('This breach is not ready to prosecute')
  }
})

And('I should see the conviction breach details', () => {
  const keys = ['Order', 'Sentenced at', 'Breach incident', 'Provider', 'Team', 'Officer', 'Status', 'Status date']
  cy.get('.govuk-summary-list').within(() => {
    keys.forEach(($key, $index) => {
      cy.get('dt').eq($index).contains($key)
    })
    cy.get('dd').eq(0).contains('ORA Community Order (12 Months)')
    cy.get('dd').eq(1).contains('Harrogate Magistrates\' Court')
    cy.get('dd').eq(2).contains('19 Feb 2020')
    cy.get('dd').eq(3).contains('NPS North East')
    cy.get('dd').eq(4).contains('Enforcement hub - Sheffield and Rotherham')
    cy.get('dd').eq(5).contains('Unallocated')
    cy.get('dd').eq(6).contains('Breach initiated')
    cy.get('dd').eq(7).contains('22 May 2020')
  })
})

And('I should see the breach document attachments', () => {
  cy.get('.govuk-table__header').eq(0).contains('File')
  cy.get('.govuk-table__header').eq(1).contains('Added by')
  cy.get('.govuk-table__header').eq(2).contains('Date added')

  cy.get('.govuk-table__cell').within(() => {
    cy.get('a').contains('NAT NPS Breach Report CO SSO_D991494.doc').should('exist')
      .should('have.attr', 'href')
      .and('include', '/attachments/D991494/documents/12346/NAT NPS Breach Report CO SSO_D991494.doc')
  })
  cy.get('.govuk-table__cell').eq(1).contains('Claire Smith')
  cy.get('.govuk-table__cell').eq(2).contains('14 Mar 2020')
})

And('If the total number of charges is greater than one', () => {
  cy.get('.govuk-accordion').should('exist')
})

Then('I should see the following list of charges in an accordion component', $data => {
  $data.raw()[0].forEach((text, index) => {
    cy.get('.govuk-accordion__section-button').eq(index).contains(text)
  })
})

Then('I should see a list of charges in an accordion component', () => {
  cy.get('.govuk-accordion').should('exist')
})

Then('the accordion section should expand', () => {
  cy.get('.govuk-accordion__section-content').should('exist')
})
