const { request, update, httpDelete } = require('./utils/request')
const getCaseListFilters = require('../utils/getCaseListFilters')
const getLatestSnapshot = require('../utils/getLatestSnapshot')
const config = require('../../config')

const isHttpSuccess = status => {
  return status / 100 === 2
}

const createCaseService = (apiUrl) => {
  return {
    getMatchDetails: async (defendantId) => {
      const res = await request(`${apiUrl}/defendant/${defendantId}/matchesDetail`) || { data: {} }
      return res.data
    },
    getCaseList: async (courtCode, date, selectedFilters, subsection) => {
      const latestSnapshot = getLatestSnapshot(date).format('YYYY-MM-DDTHH:mm:00.000')
      const { data, status } = await request(`${apiUrl}/court/${courtCode}/cases?date=${date}`)
      if (!isHttpSuccess(status)) {
        return { status, isError: true }
      }
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
              matched = matched || courtCase[filterObj.id].toString().toLowerCase() === item.value.toString().toLowerCase()
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
        unmatchedRecords: unmatchedRecords,
        filters: filters,
        cases: filteredCases,
        snapshot: latestSnapshot
      }
    },
    getCase: async (hearingId, defendantId) => {
      const res = await request(`${apiUrl}/hearing/${hearingId}/defendant/${defendantId}`)
      if(!isHttpSuccess(res.status)) {
        return { isError: true, status: res.status }
      }
      return res.data
    },
    updateOffender: async (defendantId, offenderData) => {
      return await update(`${apiUrl}/defendant/${defendantId}/offender`, offenderData)
    },
    deleteOffender: async (defendantId) => {
      return await httpDelete(`${apiUrl}/defendant/${defendantId}/offender`)
    }
  }
}

const defaultService = createCaseService(config.apis.courtCaseService.url)

module.exports = {
  ...defaultService,
  createCaseService
}
