
const getCasesInProgressHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params
  } = req

  const filters = []

  const response = await caseService.getOutcomesList(courtCode, filters, sorts, state)
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied: 0
    },
    title,
    data: response.cases || []
  }

  res.render('outcomes/casesInProgress', templateValues)
}

module.exports = getCasesInProgressHandler
