const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getHearingOutcomeAssignedToFilters = require('../../../utils/getHearingOutcomeAssignedToFilters')
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

const getPageTitle = () => `${OUTCOMES_HEADING} - Resulted cases`
const sortDirectionToMultiplier = {
  ascending: 1,
  descending: -1
}

const getResultedCasesHandler = (caseService, userPreferenceService) => async (req, res) => {
  const {
    params: { courtCode, sorts, state },
    params,
    query: queryParams
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

  const cases = [...(response.cases || [])]

  const courtRoomFilter = {
    id: 'courtRoom',
    label: 'Courtroom',
    items: prepareCourtRoomFilters(response.courtRoomFilters)
  }

  const outcomeTypesListFilters = await getOutcomeTypesListFilters()

  const filters = [outcomeTypesListFilters, courtRoomFilter]

  const assignedToFilter = getHearingOutcomeAssignedToFilters(cases, filterParams)

  if (assignedToFilter) {
    filters.push(assignedToFilter)
  }

  const flaggedFilters = flagFilters(filterParams, filters)

  const filtersApplied = flaggedFilters
    .map(filterObj => filterObj.items.filter(item => item.checked).length)
    .some(length => length > 0)

  const defendantSortDirection = params.defendantSort
  const probationStatusSortDirection = params.probationStatusSort
  if (sortDirectionToMultiplier[defendantSortDirection]) {
    const sortDirectionMultiplier = sortDirectionToMultiplier[defendantSortDirection]
    cases.sort((firstCase, secondCase) => {
      const firstDefendantName = formatDefendantName(firstCase)
      const secondDefendantName = formatDefendantName(secondCase)
      return firstDefendantName.localeCompare(secondDefendantName, undefined, { sensitivity: 'base' }) * sortDirectionMultiplier
    })
  } else if (sortDirectionToMultiplier[probationStatusSortDirection]) {
    const sortDirectionMultiplier = sortDirectionToMultiplier[probationStatusSortDirection]
    cases.sort((firstCase, secondCase) => {
      const firstProbationStatus = firstCase?.probationStatus || ''
      const secondProbationStatus = secondCase?.probationStatus || ''
      return firstProbationStatus.localeCompare(secondProbationStatus, undefined, { sensitivity: 'base' }) * sortDirectionMultiplier
    })
  }

  const baseUrl = params.pagingBaseUrl + '&'

  let templateValues = {
    params: {
      ...params,
      filters: flaggedFilters,
      filtersApplied,
      includeDefendantSort: true,
      includeProbationStatusSort: true,
      casesInProgressCount: response?.countsByState?.inProgressCount || 0,
      casesToResultCount: response?.countsByState?.toResultCount || 0
    },
    title: getPageTitle(),
    heading: OUTCOMES_HEADING,
    currentUserUuid: res.locals.user.uuid,
    data: cases || [],
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    pagination: getPagination(params.currentPage, response.totalElements, params.limit, baseUrl)
  }

  templateValues = populateTemplateValuesWithComponent(templateValues, 'filterComponent', getFilterComponent(templateValues))

  res.render('outcomes/resultedCases', templateValues)
}

module.exports = getResultedCasesHandler
