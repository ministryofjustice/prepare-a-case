const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../config')
const features = require('../../utils/features')
const trackEvent = require('../../utils/analytics.js')
const workflow = require('../../utils/workflow')
const queryParamBuilder = require('../../utils/queryParamBuilder.js')
const moment = require('moment')
const nunjucksFilters = require('../../../server/utils/nunjucksFilters.js')

const getTodaysDate = () => {
  return moment(new Date()).format('YYYY-MM-DD')
}

const createBaseUrl = (params, queryParams) => {
  const { page, ...remainder } = queryParams
  const builtQueryParamString = queryParamBuilder(remainder)
  const questionMark = builtQueryParamString.length > 0

  const date = params.date ? params.date : getTodaysDate()

  return `/${params.courtCode}/cases/${date}?${queryParamBuilder(remainder)}${questionMark ? '&' : ''}`
}

const getPagelessQueryParams = params => {
  const { page, ...remainder } = params
  return remainder
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

    const getBadge = () => {
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

      return badgeText ? `<span class="moj-badge moj-badge--${badgeColour} pac-badge">${badgeText}</span>` : ''
    }

    const getProbationStatusHtml = () => {
      let probationStatusHtml = getBadge()
      if (notMatched) {
        probationStatusHtml += capitalizeFirstLetter(item.probationStatus.toString())
      }

      console.log("🚀 ~ getProbationStatusHtml ~ item.previouslyKnownTerminationDate:", item.previouslyKnownTerminationDate)
      console.log("🚀 ~ getProbationStatusHtml ~ item.probationStatus:", item.probationStatus)

      if (!notMatched) {
        probationStatusHtml += capitalizeFirstLetter(item.probationStatus.toString())
      }

      if (item.previouslyKnownTerminationDate && item.probationStatus == 'Previously known') {
        console.log("🚀 ~ getProbationStatusHtml ~ probationStatusHtml:", 'here')
        probationStatusHtml += '<span data-cy="previously-known-termination-date" class="govuk-caption-m">Order ended ' + moment(item.previouslyKnownTerminationDate, 'YYYY-MM-DD').format("D MMMM YYYY") + '</span>';
      }

      console.log("🚀 ~ getProbationStatusHtml ~ probationStatusHtml:", probationStatusHtml)
      return `<div>${probationStatusHtml}</div>`
    }

    const constructSummaryUrl = (courtCode, hearingId, defendantId) => {
      return `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`
    }

    const constructDefendantNameLink = (ariaLabel, sanitisedName, crn, courtCode, hearingId, defendantId) => {
      const summaryUrl = constructSummaryUrl(courtCode, hearingId, defendantId)

      return `<a href="${summaryUrl}" class="pac-defendant-link govuk-!-font-weight-bold govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}">${sanitisedName}</a>${crn}`
    }

    const tableRow = [
      { html: constructDefendantNameLink(a11yTitle, sanitisedDefendantFullName, crnDisplay, params.courtCode, item.hearingId, item.defendantId) },
      // { html: (getBadge() + notMatched ? '' : capitalizeFirstLetter(item.probationStatus.toString()) + ('<span data-cy="previously-known-termination-date" class="govuk-caption-m">Order ended ' + (item.previouslyKnownTerminationDate && item.probationStatus == 'Previously known') ? escapeHtml(moment(item.previouslyKnownTerminationDate, 'YYYY-MM-DD').format('D MMMM YYYY')) + '</span>' : '')) },
      { html: getProbationStatusHtml() },
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

const getPageTitle = (params) => {
  switch (params.subsection) {
    case 'added':
      return 'Recently added cases'
    case 'removed':
      return 'Removed cases'
    default:
      return 'Case list'
  }
}

const getPageTabs = (params) => {
  const pageTabs = [];

  const getPageLink = (subsection) => {
    const subsectionLink = subsection ? `/${subsection}` : ''
    return `/${params.courtCode}/cases/${params.date}${subsectionLink}`
  }

  if (params.hearingOutcomesEnabled) {
    pageTabs.push(...[
      {
        title: 'Hearing outcome still to be added',
        a11yTitle: 'View outcome still to be added case list',
        link: getPageLink(),
        current: params.subsection === ''
      },
      {
        title: 'Hearing outcome added',
        a11yTitle: 'View outcome added case list',
        link: getPageLink('heard'),
        current: params.subsection === 'heard'
      }
    ])
  } else {
    pageTabs.push({
      title: 'Case list',
      a11yTitle: 'View current case list',
      link: getPageLink(),
      current: params.subsection === ''
    })
  }

  if (params.addedCount > 0) {
    pageTabs.push({
      title: 'Recently added',
      a11yTitle: 'View list of recently added cases',
      link: getPageLink('added'),
      current: params.subsection === 'added',
      count: params.addedCount
    })
  }

  if (params.removedCount > 0) {
    pageTabs.push({
      title: 'Removed cases',
      a11yTitle: 'View list of removed cases',
      link: getPageLink('removed'),
      current: params.subsection === 'removed',
      count: params.removedCount
    })
  }

  return pageTabs
}

const getPaginationObject = (pageParams) => {
  const maximumPages = 4
  const currentPage = pageParams.page
  let startNum = pageParams.page - ((maximumPages - 1) / 2)
  let endNum = pageParams.page + ((maximumPages - 1) / 2)
  const totalPages = Math.round(Math.ceil((pageParams.caseCount / pageParams.limit)))

  const pageItems = []
  const recentlyAddedPageItems = []
  let previousLink
  let recentlyAddedPreviousLink
  let recentlyAddedNextLink
  let nextLink

  if (startNum < 1 || totalPages <= maximumPages) {
    startNum = 1
    endNum = maximumPages
  } else if (endNum > totalPages) {
    startNum = totalPages - (maximumPages - 1)
  }

  if (endNum > totalPages) {
    endNum = totalPages
  }

  for (let i = startNum; i <= endNum; i++) {
    pageItems.push({
      text: i,
      href: pageParams.baseUrl + 'page=' + i,
      selected: currentPage === i
    })

    recentlyAddedPageItems.push({
      text: i,
      href: '/' + pageParams.courtCode + '/cases/' + pageParams.date + '/' + pageParams.subsection + '?page=' + i,
      selected: currentPage === i
    })
  }

  if (currentPage !== 1) {
    previousLink = {
      text: 'Previous',
      href: pageParams.baseUrl + 'page=' + (currentPage - 1)
    }

    recentlyAddedPreviousLink = {
      text: 'Previous',
      href: '/' + pageParams.courtCode + '/cases/' + pageParams.date + '/' + pageParams.subsection + '?page=' + (currentPage - 1)
    }
  }

  if (currentPage < totalPages) {
    nextLink = {
      text: 'Next',
      href: pageParams.baseUrl + 'page=' + (currentPage + 1)
    }

    recentlyAddedNextLink = {
      text: 'Next',
      href: '/' + pageParams.courtCode + '/cases/' + pageParams.date + '/' + pageParams.subsection + '?page=' + (currentPage + 1)
    }
  }

  return {
    maxPagesDisplay: maximumPages,
    currentPage,
    startNum,
    endNum,
    totalPages,
    pageItems,
    recentlyAddedPageItems,
    previousLink,
    recentlyAddedPreviousLink,
    nextLink,
    recentlyAddedNextLink

  }
}

const getDatesObject = (pageParams) => {
  const today = moment().format('YYYY-MM-DD')
  const isSunday = moment().day() === 0
  const dateFormat = 'dddd D MMMM'
  const currentDate = moment(params.date, 'YYYY-MM-DD')
  const useStartDate = moment().subtract(params.casesPastDays, 'days')
  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
  const withinDateRange = currentDate.isBetween(useStartDate, params.addBusinessDays(useStartDate, params.totalDays - 1), 'day', '[]')

  return {
    today,
    isSunday,
    dateFormat,
    currentDate,
    useStartDate,
    tomorrow,
    yesterday,
    withinDateRange
  }
}

const getPagedCaseListRouteHandler = caseService => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, limit, subsection },
    query: queryParams,
    session,
    path,
    params
  } = req

  const selectedFilters = queryParams
  const currentNotification = await getAsync('case-list-notification')
  const currentDate = date || getBaseDateString()
  const context = { court: courtCode, username: res.locals.user.username }
  const hearingOutcomesEnabled = features.hearingOutcomes.isEnabled(context)
  const workflowEnabled = features.workflow.isEnabled(context)
  const response = await caseService.getPagedCaseList(courtCode, currentDate, selectedFilters, subsection || (!date && session.currentView), queryParams.page, settings.casesPerPage, hearingOutcomesEnabled)
  if (response.isError) {
    trackEvent(
      'PiCPrepareACaseErrorTrace',
      {
        operation: ' getPagedCaseListRouteHandler [caseService.getPagedCaseList]',
        req,
        response
      }
    )
    res.render('error', { status: response.status || 500 })
    return
  }

  const caseCount = response.totalElements
  const startCount = ((parseInt(queryParams.page, 10) - 1) || 0) * limit
  const endCount = Math.min(startCount + parseInt(limit, 10), caseCount)

  const pastCaseNavigationEnabled = features.pastCasesNavigation.isEnabled(context)

  // God I hate myself for this...

  response.cases.forEach(cases => (cases.workflow = {
    tasks: [
      {
        id: 'prep',
        state: cases.hearingPrepStatus
      }
    ]
  }))

  if (workflowEnabled) {
    response.cases
      .forEach((myCase, i) => {
        const { workflow: myWorkflow } = myCase
        if (!myWorkflow) {
          throw new TypeError(`Array[${i}] missing workflow key`)
        }
        if (!myWorkflow.tasks) {
          throw new TypeError(`Array[${i}] missing workflow.tasks key`)
        }

        myWorkflow.tasks = {
          prep: workflow.tasks.get('prep').states.getById(myWorkflow.tasks
            .find(({ id }) => id === 'prep').state)
        }
      })
  }

  const pageParams = {
    ...params,
    workflow: {
      enabled: workflowEnabled,
      tasks: {
        prep: {
          items: workflow.tasks.get('prep').states.getAllOrderBySequence
        }
      }
    },
    hearingOutcomesEnabled,
    date: currentDate,
    notification: currentNotification || '',
    filters: response.filters,
    page: parseInt(queryParams.page, 10) || 1,
    from: startCount,
    to: endCount,
    caseCount,
    addedCount: response.recentlyAddedCount,
    unmatchedRecords: response.possibleMatchesCount,
    removedCount: response.removedCount,
    totalDays: pastCaseNavigationEnabled ? settings.casesTotalDays : 7,
    casesPastDays: pastCaseNavigationEnabled ? settings.casesPastDays : -1,
    enablePastCasesNavigation: settings.enablePastCasesNavigation,
    subsection: subsection || (!date && session.currentView) || '',
    filtersApplied: !!getPagelessQueryParams(queryParams) && Object.keys(getPagelessQueryParams(queryParams)).length > 0,
    baseUrl: createBaseUrl({ courtCode, date }, queryParams)
  }

  const templateValues = {
    title: 'Cases',
    params: pageParams,
    data: response.cases,
    tableData: constructTableData(pageParams, response.cases),
    hearingOutcomesEnabled,
    title: getPageTitle(pageParams),
    listTabs: getPageTabs(pageParams),
    pagination: getPaginationObject(pageParams),
  }
  session.currentView = subsection

  session.caseListDate = currentDate
  session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
  session.backLink = session.currentCaseListViewLink
  res.render('case-list', templateValues)
}

module.exports = getPagedCaseListRouteHandler
