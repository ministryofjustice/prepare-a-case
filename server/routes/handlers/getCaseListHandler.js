const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../config')
const features = require('../../utils/features')
const trackEvent = require('../../utils/analytics.js')

const getCaseListHandler = caseService => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, subsection },
    session,
    path,
    params
  } = req

  const page = parseInt(req.query.page, 10) || 1

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
        operation: ' getCaseListHandler [caseService.getPagedCaseList]',
        req,
        response
      }
    )
    res.render('error', { status: response.status || 500 })
    return
  }

  const caseCount = response.totalElements

  const startCount = ((parseInt(page, 10) - 1) || 0) * settings.casesPerPage
  const endCount = Math.min(startCount + parseInt(settings.casesPerPage, 10), caseCount)

  const pastCaseNavigationEnabled = features.pastCasesNavigation.isEnabled(context)

  const templateValues = {
    title: 'Cases',
    params: {
      ...params,
      hearingOutcomesEnabled,
      date: currentDate,
      notification: currentNotification || '',
      filters: response.filters,
      page,
      from: startCount,
      to: endCount,
      caseCount,
      totalPages: response.totalPages,
      addedCount: response.addedCount,
      unmatchedRecords: response.unmatchedRecords,
      totalDays: pastCaseNavigationEnabled ? settings.casesTotalDays : 7,
      casesPastDays: pastCaseNavigationEnabled ? settings.casesPastDays : -1,
      enablePastCasesNavigation: settings.enablePastCasesNavigation,
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

module.exports = getCaseListHandler
