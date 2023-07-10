const { request, update, httpDelete, create } = require('./utils/request')
const getCaseListFilters = require('../utils/getCaseListFilters')
const getOutcomeListFilterSorts = require('../utils/getOutcomesListFilterSorts')
const getLatestSnapshot = require('../utils/getLatestSnapshot')
const config = require('../../config')

const isHttpSuccess = response => {
  return response && response.status / 100 === 2
}

const getInternalServerErrorResponse = res => ({ isError: true, status: res?.status || 500 })

const defaultFilterMatcher = (courtCase, filterObj, item) => courtCase[filterObj.id] ? courtCase[filterObj.id].toString().toLowerCase() === item.value.toString().toLowerCase() : false

const createCaseService = (apiUrl) => {
  return {
    getCaseHistory: async (caseId) => {
      const res = await request(`${apiUrl}/cases/${caseId}`)
      return res.data
    },
    getMatchDetails: async (defendantId) => {
      const res = await request(`${apiUrl}/defendant/${defendantId}/matchesDetail`) || { data: {} }
      return res.data
    },
    getCaseList: async (courtCode, date, selectedFilters, subsection) => {
      const latestSnapshot = getLatestSnapshot(date).format('YYYY-MM-DDTHH:mm:00.000')
      const response = await request(`${apiUrl}/court/${courtCode}/cases?date=${date}`)
      if (!isHttpSuccess(response)) {
        return getInternalServerErrorResponse(response)
      }
      const { data } = response
      const filters = getCaseListFilters(data.cases, selectedFilters)
      const allCases = []
      const addedCases = []
      const removedCases = []
      let unmatchedRecords = 0
      if (data && data.cases) {
        data.cases.forEach($case => {
          if ($case.probationStatus.toLowerCase() === 'possible ndelius record' && $case.numberOfPossibleMatches > 0) {
            unmatchedRecords++
          }
          if ($case.createdToday) {
            allCases.push($case)
            addedCases.push($case)
          } else if ($case.removed) {
            removedCases.push($case)
          } else {
            allCases.push($case)
          }
        })
      }

      let filteredCases = subsection === 'added' ? addedCases : subsection === 'removed' ? removedCases : allCases

      function applyFilter (filterObj) {
        filteredCases = filteredCases.filter(courtCase => {
          let notFiltered = true
          let matched = false
          filterObj.items.forEach(item => {
            if (item && item.checked) {
              notFiltered = false
              matched = matched || (filterObj.matcher ? filterObj.matcher(courtCase, item) : defaultFilterMatcher(courtCase, filterObj, item))
            }
          })
          return notFiltered || matched
        })
      }

      if (filters && filteredCases && !subsection) {
        filters.forEach(filterObj => {
          applyFilter(filterObj)
        })
      }

      return {
        ...data,
        totalCount: allCases.length,
        addedCount: addedCases.length,
        removedCount: removedCases.length,
        unmatchedRecords,
        filters,
        cases: filteredCases,
        snapshot: latestSnapshot
      }
    },

    getOutcomesList: async (courtCode, selectedFilterSorts, subsection) => {
      const { filters, sorts } = getOutcomeListFilterSorts(selectedFilterSorts)

      const filterMap = {
        'Probation sentence': 'PROBATION_SENTENCE',
        'Non-probation sentence': 'NON_PROBATION_SENTENCE',
        'Report requested': 'REPORT_REQUESTED',
        Adjourned: 'ADJOURNED',
        'Committed to Crown': 'COMMITTED_TO_CROWN',
        'Crown plus PSR': 'CROWN_PLUS_PSR',
        Other: 'OTHER'
      }

      const paramMap = new URLSearchParams({
        state: 'NEW'
      })

      filters.forEach(filter => filter.items.filter(item => item.checked).forEach(item => {
        paramMap.append(filter.id, filterMap[item.value])
      }))

      const allowedSortValues = { ascending: 'ASC', descending: 'DESC' }

      sorts.forEach(sort => {
        if (sort.value !== 'none' && allowedSortValues[sort.value]) {
          paramMap.append('sortBy', sort.id)
          paramMap.append('order', allowedSortValues[sort.value])
        }
      })

      const urlString = `${apiUrl}/courts/${courtCode}/hearing-outcomes?${paramMap}`

      const response = await request(urlString)
      if (!isHttpSuccess(response)) {
        return getInternalServerErrorResponse(response)
      }
      const { data } = response
      const casesToResult = data.cases
      const casesInProgress = []
      const casesResulted = []

      const filteredCases = subsection === 'in-progress' ? casesInProgress : subsection === 'resulted-cases' ? casesResulted : casesToResult

      return {
        ...data,
        totalCount: casesToResult.length,
        inProgressCount: casesInProgress.length,
        resultedCount: casesResulted.length,
        filters,
        sorts,
        cases: filteredCases
      }
    },

    searchCases: async (term, type, page, pageSize) => {
      try {
        return await request(`${apiUrl}/search`, { term, type, page, size: pageSize })
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return { data: {} }
        }
        throw e
      }
    },

    getCase: async (hearingId, defendantId) => {
      const res = await request(`${apiUrl}/hearing/${hearingId}/defendant/${defendantId}`)
      if (!isHttpSuccess(res)) {
        return getInternalServerErrorResponse(res)
      }
      return res.data
    },
    updateOffender: async (defendantId, offenderData) => {
      return await update(`${apiUrl}/defendant/${defendantId}/offender`, offenderData)
    },
    deleteOffender: async (defendantId) => {
      return await httpDelete(`${apiUrl}/defendant/${defendantId}/offender`)
    },
    addCaseComment: async (caseId, comment, author) => await create(`${apiUrl}/cases/${caseId}/comments`, { caseId, comment, author }),
    updateCaseComment: async (caseId, commentId, comment, author) => await update(`${apiUrl}/cases/${caseId}/comments/${commentId}`, { caseId, comment, author }),
    deleteCaseComment: async (caseId, commentId) => await httpDelete(`${apiUrl}/cases/${caseId}/comments/${commentId}`),
    addHearingNote: async (hearingId, note, author) => await create(`${apiUrl}/hearing/${hearingId}/notes`, { hearingId, note, author }),
    saveDraftHearingNote: async (hearingId, note, author) => await update(`${apiUrl}/hearing/${hearingId}/notes/draft`, { hearingId, note, author }),
    updateHearingNote: async (hearingId, note, noteId, author) => await update(`${apiUrl}/hearing/${hearingId}/notes/${noteId}`, { hearingId, note, author, noteId }),
    deleteHearingNote: async (hearingId, noteId) => await httpDelete(`${apiUrl}/hearing/${hearingId}/notes/${noteId}`),
    deleteHearingNoteDraft: async (hearingId) => {
      try {
        await httpDelete(`${apiUrl}/hearing/${hearingId}/notes/draft`)
      } catch (e) {
        if (e.response?.status === 404) {
          return // if the note draft has never been saved, delete would return 404 which we should be ignoring it.
        }
        throw e
      }
    },
    addHearingOutcome: async (hearingId, hearingOutcomeType) => await update(`${apiUrl}/hearing/${hearingId}/outcome`, { hearingOutcomeType }),
    saveDraftCaseComment: async (caseId, comment, author) => await update(`${apiUrl}/cases/${caseId}/comments/draft`, { caseId, comment, author }),
    deleteCaseCommentDraft: async (caseId) => {
      try {
        await httpDelete(`${apiUrl}/cases/${caseId}/comments/draft`)
      } catch (e) {
        if (e.response?.status === 404) {
          return // if the comment draft has never been saved, delete would return 404 which we should be ignoring it.
        }
        throw e
      }
    }
  }
}

const defaultService = createCaseService(config.apis.courtCaseService.url)

module.exports = {
  ...defaultService,
  createCaseService
}
