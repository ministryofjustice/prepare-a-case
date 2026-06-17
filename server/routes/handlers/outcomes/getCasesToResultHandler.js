const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const flagFilters = require('../../../utils/flagFilters')
const trackEvent = require('../../../utils/analytics.js')
const { prepareCourtRoomFilters } = require('../../helpers')
const { getFilterComponent, populateTemplateValuesWithComponent } = require('../../../utils/nunjucksComponents.js')
const { getPagination } = require('../../../utils/pagination')

const FILTER_CATEGORY_NAME = 'outcomesFilters'

const getPagelessQueryParams = params => {
  const { page, ...remainder } = params
  return remainder
}

const getCasesToResultHandler = (caseService, userPreferenceService) => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params,
    query: queryParams,
    session
  } = req

  let filterParams = getPagelessQueryParams(queryParams)

  if (Object.keys(filterParams).length <= 0) {
    filterParams = await userPreferenceService.getFilters(res.locals.user.username, FILTER_CATEGORY_NAME, courtCode)
    trackEvent('PiCPrepareACaseFilters', {
      filterType: FILTER_CATEGORY_NAME,
      action: 'Loaded from user preference service',
      filters: filterParams
    })
  } else {
    await userPreferenceService.setFilters(res.locals.user.username, FILTER_CATEGORY_NAME, courtCode, filterParams)
    trackEvent('PiCPrepareACaseFilters', {
      filterType: FILTER_CATEGORY_NAME,
      action: 'Saved into user preference service',
      filters: filterParams
    })
  }

  const response = await caseService.getOutcomesList(
    courtCode,
    { ...filterParams, ...queryParams },
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

  const filters = flagFilters(filterParams, [
    outcomeTypesListFilters,
    courtRoomFilter
  ])

  const filtersApplied = filters
    .map(filterObj => filterObj.items.filter(item => item.checked).length)
    .some(length => length > 0)

  const baseUrl = params.pagingBaseUrl + '&'

  let templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      casesInProgressCount: response?.countsByState?.inProgressCount || 0,
      casesToResultCount: response.totalElements
    },
    title,
    data: response.cases || [],
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    outcomeActionAssign: session.outcomeActionAssign,
    pagination: getPagination(params.currentPage, response.totalElements, params.limit, baseUrl)
  }

  delete session.outcomeActionAssign

  templateValues = populateTemplateValuesWithComponent(templateValues, 'filterComponent', getFilterComponent(templateValues))

  res.render('outcomes/casesToResult', templateValues)
}

module.exports = getCasesToResultHandler
