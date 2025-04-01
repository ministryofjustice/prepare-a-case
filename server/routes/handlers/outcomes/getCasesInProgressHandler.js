const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getHearingOutcomeAssignedToFilters = require('../../../utils/getHearingOutcomeAssignedToFilters')
const flagFilters = require('../../../utils/flagFilters')
const { prepareCourtRoomFilters } = require('../../helpers')
const { getFilterComponent, populateTemplateValuesWithComponent } = require('../../../utils/nunjucksComponents.js')
const { getPagination } = require('../../../utils/pagination')

const getPagelessQueryParams = params => {
  const { page, ...remainder } = params
  return remainder
}

const getCasesInProgressHandler = (caseService, userPreferenceService) => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params,
    session,
    query: queryParams
  } = req

  let filterParams = getPagelessQueryParams(queryParams)

  if (Object.keys(filterParams).length <= 0) {
    filterParams = await userPreferenceService.getFilters(res.locals.user.username, 'outcomesFilters')
  } else {
    await userPreferenceService.setFilters(res.locals.user.username, 'outcomesFilters', filterParams)
  }

  const getGlobalErrors = () => {
    let errors = req.flash('global-error')

    if (typeof errors === 'string') {
      errors = [errors]
    }
    return errors ? errors.map((error) => ({ text: error })) : undefined
  }

  const flashMessage = req.flash('moved-to-resulted')
  const globalErrors = getGlobalErrors()

  const response = await caseService.getOutcomesList(
    courtCode,
    { ...filterParams, ...queryParams },
    sorts,
    state
  )

  const cases = response.cases

  const courtRoomFilter = {
    id: 'courtRoom',
    label: 'Courtroom',
    items: prepareCourtRoomFilters(response.courtRoomFilters)
  }

  const outcomeTypesListFilters = await getOutcomeTypesListFilters()

  const filters = [outcomeTypesListFilters, courtRoomFilter]
  const assignedToFilter = getHearingOutcomeAssignedToFilters(
    cases,
    queryParams
  )

  if (assignedToFilter) {
    filters.push(assignedToFilter)
  }

  const flaggedFilters = flagFilters(filterParams, filters)

  const filtersApplied = flaggedFilters
    .map(filterObj => filterObj.items.filter(item => item.checked).length)
    .some(length => length > 0)

  const baseUrl = params.pagingBaseUrl + '&'

  let templateValues = {
    params: {
      ...params,
      filters: flaggedFilters,
      filtersApplied,
      casesInProgressCount: response?.totalElements || 0,
      casesToResultCount: response?.countsByState?.toResultCount || 0
    },
    title,
    currentUserUuid: res.locals.user.uuid,
    moveToResultedSuccess: session.moveToResultedSuccess,
    data: response.cases || [],
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    flashMessage,
    globalErrors,
    pagination: getPagination(params.currentPage, response.totalElements, params.limit, baseUrl)
  }
  session.moveToResultedSuccess = undefined

  templateValues = populateTemplateValuesWithComponent(templateValues, 'filterComponent', getFilterComponent(templateValues))

  res.render('outcomes/casesInProgress', templateValues)
}
module.exports = getCasesInProgressHandler
