const { request, update, http_delete } = require('./utils/request')
const getCaseListFilters = require('../utils/getCaseListFilters')
const getLatestSnapshot = require('../utils/getLatestSnapshot')
const config = require('../../config')
const apiUrl = config.apis.courtCaseService.url

const getCaseList = async (courtCode, date, selectedFilters, subsection) => {
  const latestSnapshot = getLatestSnapshot(date).format('YYYY-MM-DDTHH:mm:00.000')
  const res = await request(`${apiUrl}/court/${courtCode}/cases?date=${date}`) || { data: { cases: [] } }
  const filters = getCaseListFilters(res.data.cases, selectedFilters)
  const allCases = []
  const addedCases = []
  const removedCases = []
  let unmatchedRecords = 0
  if (res.data && res.data.cases) {
    res.data.cases.forEach($case => {
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
    ...res.data,
    totalCount: allCases.length,
    addedCount: addedCases.length,
    removedCount: removedCases.length,
    unmatchedRecords: unmatchedRecords,
    filters: filters,
    cases: filteredCases,
    snapshot: latestSnapshot
  }
}

const getCase = async (hearingId, defendantId) => {
  const res = await request(`${apiUrl}/hearing/${hearingId}/defendant/${defendantId}`) || { data: {} }
  return res.data
}

const updateCase = async (caseId, defendantId, caseData) => {
  throw new Error("Deprecated method updateCase")
}

const getMatchDetails = async (caseId, defendantId) => {
  const res = await request(`${apiUrl}/case/${caseId}/defendant/${defendantId}/matchesDetail`) || { data: {} }
  return res.data
}

const updateOffender = async (defendantId, offenderData) => {
  return await update(`${apiUrl}/defendant/${defendantId}/offender`, offenderData)
}

const deleteOffender = async (defendantId) => {
  return await http_delete(`${apiUrl}/defendant/${defendantId}/offender`)
}

module.exports = {
  getMatchDetails,
  getCaseList,
  getCase,
  updateCase,
  updateOffender,
  deleteOffender
}
