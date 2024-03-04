const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const flagFilters = require('../../../utils/flagFilters')
const { prepareCourtRoomFilters } = require('../../helpers')
const getCasesToResultHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params,
    query: queryParams,
    session
  } = req

  const response = await caseService.getOutcomesList(
    courtCode,
    queryParams,
    sorts,
    state
  )
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }

  const courtRoomFilter = {
    id: 'courtRoom',
    label: 'Courtroom',
    items: prepareCourtRoomFilters(response.courtRoomFilters)
  }

  const outcomeTypesListFilters = await getOutcomeTypesListFilters()

  const filters = flagFilters(queryParams, [
    outcomeTypesListFilters,
    courtRoomFilter
  ])

  const filtersApplied = filters
    .map(filterObj => filterObj.items.filter(item => item.checked).length)
    .some(length => length > 0)

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      casesInProgressCount: response?.countsByState?.inProgressCount || 0,
      casesToResultCount: response.totalElements
    },
    title,
    data: response.cases || [],
    displayFilters: response.cases?.length || filtersApplied,
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    outcomeActionAssign: session.outcomeActionAssign
  }

  delete session.outcomeActionAssign

  res.render('outcomes/casesToResult', templateValues)
}

module.exports = getCasesToResultHandler
