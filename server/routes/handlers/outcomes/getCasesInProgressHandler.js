const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')

const getCasesInProgressHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params,
    session
  } = req

  const filters = getOutcomeTypesListFilters(req.query)
  const filtersApplied = filters.map(filterObj => filterObj.items.filter(item => item.checked).length).pop()

  const response = await caseService.getOutcomesList(courtCode, filters, sorts, state)
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      casesInProgressCount: filtersApplied ? response.cases.length : params.casesInProgressCount
    },
    title,
    currentUserUuid: res.locals.user.uuid,
    moveToResultedSuccess: session.moveToResultedSuccess,
    data: response.cases || []
  }
  session.moveToResultedSuccess = undefined

  res.render('outcomes/casesInProgress', templateValues)
}

module.exports = getCasesInProgressHandler
