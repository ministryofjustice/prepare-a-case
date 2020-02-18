const { request } = require('./utils/request')
const { apiUrl } = require('../config/defaults')

const getCaseList = async (courtCode, date) => {
  const res = await request(`${apiUrl}/court/${courtCode}/cases?date=${date}`)
  return res.data
}

const getCase = async (courtCode, caseNo) => {
  const res = await request(`${apiUrl}/court/${courtCode}/case/${caseNo}`)
  return res.data
}

module.exports = {
  getCaseList,
  getCase
}
