const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../config')
const features = require('../../utils/features')
const trackEvent = require('../../utils/analytics.js')
const workflow = require('../../utils/workflow')
const queryParamBuilder = require('../../utils/queryParamBuilder.js')
const { getFilterComponent, populateTemplateValuesWithComponent } = require('../../utils/nunjucksComponents.js')
const moment = require('moment')
const { constructTableData } = require('../../utils/caseListTableData.js')
const { getPagination } = require('../../utils/pagination')

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
  const pageTabs = []

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
  const currentPage = pageParams.page
  const pagination = getPagination(currentPage, pageParams.caseCount, pageParams.limit, pageParams.baseUrl)

  const recentlyAddedPageItems = []
  pagination.pageItems.forEach(x => {
    recentlyAddedPageItems.push({
      ...x,
      href: '/' + pageParams.courtCode + '/cases/' + pageParams.date + '/' + pageParams.subsection + '?page=' + x.text
    })
  })

  const recentlyAddedPreviousLink = pagination.previousLink !== null
    ? {
        ...pagination.previousLink,
        href: '/' + pageParams.courtCode + '/cases/' + pageParams.date + '/' + pageParams.subsection + '?page=' + (currentPage - 1)
      }
    : null

  const recentlyAddedNextLink = pagination.nextLink !== null
    ? {
        ...pagination.nextLink,
        href: '/' + pageParams.courtCode + '/cases/' + pageParams.date + '/' + pageParams.subsection + '?page=' + (currentPage + 1)
      }
    : null

  const totalPages = Math.round(Math.ceil((pageParams.caseCount / pageParams.limit)))

  return {
    ...pagination,
    totalPages,
    recentlyAddedPageItems,
    recentlyAddedPreviousLink,
    recentlyAddedNextLink
  }
}

const getPagedCaseListRouteHandler = (caseService, userPreferenceService) => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, limit, subsection },
    query: queryParams,
    session,
    path,
    params
  } = req

  let selectedFilters = getPagelessQueryParams(queryParams)

  if (Object.keys(selectedFilters).length <= 0) {
    selectedFilters = await userPreferenceService.getFilters(res.locals.user.username, 'caseFilters')
  } else {
    await userPreferenceService.setFilters(res.locals.user.username, 'caseFilters', selectedFilters)
  }

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

  let templateValues = {
    params: pageParams,
    data: response.cases,
    tableData: constructTableData(pageParams, response.cases),
    hearingOutcomesEnabled,
    title: getPageTitle(pageParams),
    listTabs: getPageTabs(pageParams),
    pagination: getPaginationObject(pageParams)
  }

  session.currentView = subsection

  session.caseListDate = currentDate
  session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
  session.backLink = session.currentCaseListViewLink

  templateValues = populateTemplateValuesWithComponent(templateValues, 'filterComponent', getFilterComponent(templateValues))

  res.render('case-list', templateValues)
}

module.exports = getPagedCaseListRouteHandler
