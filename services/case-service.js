const { request } = require('./utils/request')
const { apiUrl } = require('../config/defaults')

const getCaseList = async (courtCode, date, filters, subsection) => {
  const res = await request(`${apiUrl}/court/${courtCode}/cases?date=${date}`)

  let filteredCases = res.data && res.data.cases ? res.data.cases : []

  function applyFilter (filterObj) {
    filteredCases = filteredCases.filter(courtCase => {
      let notFiltered = true
      let matched = false
      filterObj.items.forEach(item => {
        if (item.checked) {
          notFiltered = false
          matched = matched || courtCase[filterObj.id].toString() === item.value.toString()
        }
      })
      return notFiltered || matched
    })
  }

  if (filters && filteredCases) {
    filters.forEach(filterObj => {
      applyFilter(filterObj)
    })
  }

  return {
    ...res.data,
    cases: filteredCases
  }
}

const getCase = async (courtCode, caseNo) => {
  const res = await request(`${apiUrl}/court/${courtCode}/case/${caseNo}`)
  return res.data
}

module.exports = {
  getCaseList,
  getCase
}
