const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../../config')
const features = require('../../utils/features')
const trackEvent = require('../../utils/analytics.js')

const getPagedCaseListRouteHandler = caseService => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, limit, subsection },
    query: { page },
    session,
    path,
    params
  } = req

  const selectedFilters = session.selectedFilters
  const currentNotification = await getAsync('case-list-notification')
  const currentDate = date || getBaseDateString()
  const context = { court: courtCode, username: res.locals.user.username }
  const hearingOutcomesEnabled = features.hearingOutcomes.isEnabled(context)
  const response = await caseService.getPagedCaseList(courtCode, currentDate, selectedFilters, subsection || (!date && session.currentView), page, settings.casesPerPage, hearingOutcomesEnabled)
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
  const startCount = ((parseInt(page, 10) - 1) || 0) * limit
  const endCount = Math.min(startCount + parseInt(limit, 10), caseCount)

  const pastCaseNavigationEnabled = features.pastCasesNavigation.isEnabled(context)
  const caseSearchEnabled = features.searchFeature.isEnabled(context)

  const templateValues = {
    title: 'Cases',
    params: {
      ...params,
      hearingOutcomesEnabled,
      date: currentDate,
      notification: currentNotification || '',
      filters: response.filters,
      page: parseInt(page, 10) || 1,
      from: startCount,
      to: endCount,
      caseCount,
      addedCount: response.recentlyAddedCount,
      unmatchedRecords: response.possibleMatchesCount,
      totalDays: pastCaseNavigationEnabled ? settings.casesTotalDays : 7,
      casesPastDays: pastCaseNavigationEnabled ? settings.casesPastDays : -1,
      enablePastCasesNavigation: settings.enablePastCasesNavigation,
      caseSearchEnabled,
      subsection: subsection || (!date && session.currentView) || '',
      filtersApplied: !!selectedFilters && Object.keys(selectedFilters).length
    },
    data: response.cases,
    hearingOutcomesEnabled
  }
  session.currentView = subsection

  session.caseListDate = currentDate
  session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
  session.backLink = session.currentCaseListViewLink
  res.render('case-list', templateValues)
}

module.exports = getPagedCaseListRouteHandler
