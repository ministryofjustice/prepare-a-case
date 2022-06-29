const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../../config')

const getCaseListRouteHandler = caseService => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, limit, subsection },
    query: { page },
    session,
    path,
    params
  } = req
  const currentNotification = await getAsync('case-list-notification')
  const currentDate = date || getBaseDateString()
  const response = await caseService.getCaseList(courtCode, currentDate, session.selectedFilters, subsection || (!date && session.currentView))
  if (response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }
  const caseCount = response.cases.length
  const startCount = ((parseInt(page, 10) - 1) || 0) * limit
  const endCount = Math.min(startCount + parseInt(limit, 10), caseCount)
  const templateValues = {
    title: 'Cases',
    params: {
      ...params,
      date: currentDate,
      notification: currentNotification || '',
      filters: response.filters,
      page: parseInt(page, 10) || 1,
      from: startCount,
      to: endCount,
      totalCount: response.totalCount,
      caseCount: caseCount,
      addedCount: response.addedCount,
      removedCount: response.removedCount,
      unmatchedRecords: response.unmatchedRecords,
      totalDays: settings.casesTotalDays,
      subsection: subsection || (!date && session.currentView) || '',
      filtersApplied: !!session.selectedFilters && Object.keys(session.selectedFilters).length,
      snapshot: response.snapshot
    },
    data: response.cases.slice(startCount, endCount) || []
  }
  session.currentView = subsection
  session.caseListDate = currentDate
  session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
  session.backLink = session.currentCaseListViewLink
  res.render('case-list', templateValues)
}

module.exports = getCaseListRouteHandler
