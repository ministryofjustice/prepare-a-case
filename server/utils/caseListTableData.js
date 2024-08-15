const nunjucksFilters = require('./nunjucksFilters.js')
const moment = require('moment')

const getBadge = (item, notMatched) => {
  let badgeColour = 'black'
  let badgeText = ''

  if (notMatched) {
    badgeColour = 'red'
    badgeText = 'Possible NDelius Record'
  }

  if (item.awaitingPsr) {
    badgeText = 'Psr'
  }

  if (item.breach) {
    badgeText = 'Breach'
  }

  if (item.suspendedSentenceOrder) {
    badgeText = 'Sso'
  }

  return badgeText ? `<div><span class="moj-badge moj-badge--${badgeColour} pac-badge">${badgeText}</span></div>` : ''
}

const getProbationStatusHtml = (item, notMatched) => {
  const { capitalizeFirstLetter } = nunjucksFilters

  let probationStatusHtml = getBadge(item, notMatched)
  if (notMatched) {
    probationStatusHtml += capitalizeFirstLetter(item.probationStatus.toString())
  }

  if (!notMatched) {
    probationStatusHtml += capitalizeFirstLetter(item.probationStatus.toString())
  }

  if (item.previouslyKnownTerminationDate && item.probationStatus === 'Previously known') {
    probationStatusHtml += '<span data-cy="previously-known-termination-date" class="govuk-caption-m">Order ended ' + moment(item.previouslyKnownTerminationDate, 'YYYY-MM-DD').format('D MMMM YYYY') + '</span>'
  }

  return probationStatusHtml
}

const constructTableData = (params, data) => {
  const { courtRoomDisplay, escapeHtml, ordinalNumber, apostropheInName, properCase, removeTitle, capitalizeFirstLetter } = nunjucksFilters
  const tableData = {
    head: [
      { text: 'Defendant' },
      { text: 'Probation status' },
      { text: 'Offence' },
      { text: 'Listing' },
      { text: 'Session' },
      { text: 'Court', format: 'numeric' }
    ],
    rows: []
  }

  if (params.subsection) {
    tableData.head.push({ text: 'Libra case number', format: 'numeric' })
  }

  if (params.workflow.enabled) {
    tableData.head.push({ html: 'Admin prep status' })
  }

  data.forEach(item => {
    const offences = []
    const courtRoom = courtRoomDisplay(item.courtRoom)
    const notMatched = item.probationStatus.toString().toLowerCase() === 'possible ndelius record'
    const listing = []
    const updatedListing = []

    if (item.offences.length === 1) {
      item.offences.forEach(offence => {
        offences.push(nunjucksFilters.escapeHtml(offence.offenceTitle))
      })
    } else if (item.offences) {
      offences.push('<ol class="govuk-list govuk-list--number govuk-!-margin-bottom-0">')
      item.offences.forEach(offence => {
        offences.push(`<li>${escapeHtml(offence.offenceTitle)}</li>`)
      })
      offences.push('</ol>')
    }

    if (item.source === 'COMMON_PLATFORM') {
      item.offences.forEach(cpListNo => {
        updatedListing.push(cpListNo.listNo)
      })

      if (nunjucksFilters.unique(updatedListing).length === 1) {
        listing.push(escapeHtml(ordinalNumber(updatedListing[0])))
      } else {
        listing.push('<ol class="govuk-list govuk-!-margin-bottom-0">')
        updatedListing.forEach(listingItem => {
          listing.push(`<li>${escapeHtml(ordinalNumber(listingItem))}</li>`)
        })
        listing.push('</ol>')
      }
    } else {
      listing.push(item.listNo)
    }

    const defendantFullName = (item.name && item.name.forename1 && item.name.surname) ? `${item.name.forename1} ${item.name.surname}` : item.defendantName
    const sanitisedDefendantFullName = escapeHtml(apostropheInName(properCase(removeTitle(defendantFullName))))
    const a11yTitle = `View case for defendant ${sanitisedDefendantFullName}`
    const crnDisplay = `<div class="pac-secondary-text govuk-body-s govuk-!-margin-top-1">${item.crn ? item.crn : ''}</div>`

    const constructSummaryUrl = (courtCode, hearingId, defendantId) => {
      return `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`
    }

    const constructDefendantNameLink = (ariaLabel, sanitisedName, crn, courtCode, hearingId, defendantId) => {
      const summaryUrl = constructSummaryUrl(courtCode, hearingId, defendantId)

      return `<a href="${summaryUrl}" class="pac-defendant-link govuk-!-font-weight-bold govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}">${sanitisedName}</a>${crn}`
    }

    const tableRow = [
      { html: constructDefendantNameLink(a11yTitle, sanitisedDefendantFullName, crnDisplay, params.courtCode, item.hearingId, item.defendantId) },
      { html: getProbationStatusHtml(item, notMatched) },
      { html: offences.join('') },
      { html: listing.join('') },
      { text: capitalizeFirstLetter(item.session) },
      { text: courtRoom, format: 'numeric' }
    ]

    if (params.subsection === 'removed') {
      tableRow.push({ text: item.caseNo, format: 'numeric' })
    }

    if (params.workflow.enabled) {
      let html = '<select class="workflow-tasks-status-selector" aria-label="Admin prep status" data-form-action="/workflow/tasks/prep/state?hearing=' + item.hearingId +
        '&defendant=' + item.defendantId + '" data-defendant-fullname="' +
        sanitisedDefendantFullName + '">'

      params.workflow.tasks.prep.items.forEach(prepItem => {
        html = html + '<option value="' + prepItem.id + '" data-css-class="' + prepItem.cssClass + '"'

        if (prepItem === item.workflow.tasks.prep) {
          html = html + ' selected'
        }

        html = html + '>' + prepItem.lang.en.title + '</option>'
      })

      html = html + '</selec>'

      tableRow.push({ html })
    }

    tableData.rows.push(tableRow)
  })

  return tableData
}

module.exports = {
  constructTableData,
  getBadge,
  getProbationStatusHtml
}
