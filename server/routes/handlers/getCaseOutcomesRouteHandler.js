const getCaseOutcomesRouteHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, subsection },
    session,
    params
  } = req
  const response = await caseService.getOutcomesList(courtCode, req.query, subsection)
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }
  const caseCount = response.cases.length
  const filtersApplied = response.filters.filter(filter => filter.items.filter(item => item.checked).length > 0).length

  const hearingDateSort = response.sorts && response.sorts.map(item => item.value).pop()

  const templateValues = {
    title: 'Hearing outcomes',
    params: {
      ...params,
      filters: response.filters,
      sorts: response.sorts,
      totalCount: response.totalCount,
      caseCount,
      inProgressCount: response.inProgressCount,
      resultedCount: response.resultedCount,
      unmatchedRecords: response.unmatchedRecords,
      subsection: subsection || session.currentView || '',
      filtersApplied,
      snapshot: response.snapshot,
      hearingDateSort
    },
    data: response.cases || []
  }

  res.render('outcomes', templateValues)
}

module.exports = getCaseOutcomesRouteHandler
