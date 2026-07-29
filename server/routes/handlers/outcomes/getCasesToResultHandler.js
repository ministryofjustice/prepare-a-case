const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const flagFilters = require('../../../utils/flagFilters')
const { prepareCourtRoomFilters } = require('../../helpers')
const { getFilterComponent, populateTemplateValuesWithComponent } = require('../../../utils/nunjucksComponents.js')
const { getPagination } = require('../../../utils/pagination')
const { formatDefendantName } = require('../../../utils/nunjucksFilters')
const { OUTCOMES_HEADING } = require('./constants')

const getPagelessQueryParams = params => {
  const { page, ...remainder } = params
  return remainder
}

const getPageTitle = () => `${OUTCOMES_HEADING} - Cases to result`
const sortDirectionToMultiplier = {
  ascending: 1,
  descending: -1
}

const getCasesToResultHandler = (caseService, userPreferenceService) => async (req, res) => {
  const {
    params: { courtCode, sorts, state },
    params,
    query: queryParams,
    session
  } = req

  let filterParams = getPagelessQueryParams(queryParams)

  if (Object.keys(filterParams).length <= 0) {
    filterParams = await userPreferenceService.getFilters(res.locals.user.username, 'outcomesFilters')
  } else {
    await userPreferenceService.setFilters(res.locals.user.username, 'outcomesFilters', filterParams)
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

  const sortedCases = [...(response.cases || [])]
  const defendantSortDirection = params.defendantSort
  const probationStatusSortDirection = params.probationStatusSort
  if (sortDirectionToMultiplier[defendantSortDirection]) {
    const sortDirectionMultiplier = sortDirectionToMultiplier[defendantSortDirection]
    sortedCases.sort((firstCase, secondCase) => {
      const firstDefendantName = formatDefendantName(firstCase)
      const secondDefendantName = formatDefendantName(secondCase)
      return firstDefendantName.localeCompare(secondDefendantName, undefined, { sensitivity: 'base' }) * sortDirectionMultiplier
    })
  } else if (sortDirectionToMultiplier[probationStatusSortDirection]) {
    const sortDirectionMultiplier = sortDirectionToMultiplier[probationStatusSortDirection]
    sortedCases.sort((firstCase, secondCase) => {
      const firstProbationStatus = firstCase?.probationStatus || ''
      const secondProbationStatus = secondCase?.probationStatus || ''
      return firstProbationStatus.localeCompare(secondProbationStatus, undefined, { sensitivity: 'base' }) * sortDirectionMultiplier
    })
  }

  const baseUrl = params.pagingBaseUrl + '&'

  let templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      includeDefendantSort: true,
      includeProbationStatusSort: true,
      casesInProgressCount: response?.countsByState?.inProgressCount || 0,
      casesToResultCount: response.totalElements
    },
    title: getPageTitle(),
    heading: OUTCOMES_HEADING,
    data: sortedCases,
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
