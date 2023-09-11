const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getResultedCasesHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params
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
    data: response.cases || []
  }

  res.render('outcomes/resultedCases', templateValues)
}

module.exports = getResultedCasesHandler
