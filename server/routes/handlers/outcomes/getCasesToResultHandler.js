const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getCasesToResultHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params
  } = req

  console.log('getCasesToResultHandler', req.query)
  const filters = getOutcomeTypesListFilters(req.query)

  const filtersApplied = filters.map(filterObj => filterObj.items.length > 0)

  const response = await caseService.getOutcomesList(courtCode, filters, sorts, state)
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied
    },
    title,
    data: response.cases || []
  }

  res.render('outcomes/casesToResult', templateValues)
}

module.exports = getCasesToResultHandler
