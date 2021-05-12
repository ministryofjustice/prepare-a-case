const { request, update } = require('./utils/request')
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
        if (item.checked) {
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

const getCase = async (courtCode, caseNo) => {
  const res = await request(`${apiUrl}/court/${courtCode}/case/${caseNo}`) || { data: {} }
  return res.data
}

const updateCase = async (courtCode, caseNo, caseData) => {
  return await update(`${apiUrl}/court/${courtCode}/case/${caseNo}`, caseData)
}

const getMatchDetails = async (courtCode, caseNo) => {
  const res = await request(`${apiUrl}/court/${courtCode}/case/${caseNo}/matchesDetail`) || { data: {} }
  return res.data
}

module.exports = {
  getMatchDetails,
  getCaseList,
  getCase,
  updateCase
}
