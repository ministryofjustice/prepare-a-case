const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const flagFilters = require('../../../utils/flagFilters')
const getCasesToResultHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params,
    query: queryParams
  } = req

  const response = await caseService.getOutcomesList(courtCode, queryParams, sorts, state)
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }

  const filters = flagFilters(queryParams, [getOutcomeTypesListFilters()])

  const filtersApplied = filters.map(filterObj => filterObj.items.filter(item => item.checked).length).pop()

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      casesToResultCount: filtersApplied ? response.cases.length : params.casesToResultCount
    },
    title,
    data: response.cases || []
  }

  res.render('outcomes/casesToResult', templateValues)
}

module.exports = getCasesToResultHandler
