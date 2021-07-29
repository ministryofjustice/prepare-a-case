const { request, requestFile } = require('./utils/request')
const config = require('../../config')
const apiUrl = config.apis.courtCaseService.url

const getConviction = async (crn, convictionId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}`) || { data: {} }
  return res.data
}

const getCustodyDetails = async (crn, convictionId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}/sentence/custody`) || { data: undefined }
  return res.data
}

const getProbationRecord = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/probation-record`) || { data: {} }
  return res.status >= 400 ? res : res.data
}

const getSentenceDetails = async (crn, convictionId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}/sentence`) || { data: {} }
  return res.data
}

const getBreachDetails = async (crn, convictionId, breachId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}/breaches/${breachId}`) || { data: {} }
  return res.data
}

const getAttachment = async (crn, documentId) => {
  return await requestFile(`${apiUrl}/offender/${crn}/documents/${documentId}`) || {}
}

const getDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/detail`) || {}
  return res.status >= 400 ? res : res.data
}

const getProbationStatusDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/probation-status-detail`) || {}
  return res.status >= 400 ? res : res.data
}

const getRiskDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/registrations`) || { data: {} }
  return res.data
}

module.exports = {
  getDetails,
  getProbationRecord,
  getProbationStatusDetails,
  getSentenceDetails,
  getBreachDetails,
  getAttachment,
  getRiskDetails,
  getConviction,
  getCustodyDetails
}
