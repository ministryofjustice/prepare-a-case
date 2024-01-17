const { request, requestFile } = require('./utils/request')
const config = require('../config')
const apiUrl = config.apis.courtCaseService.url
const logger = require('../log')

const getConviction = async (crn, convictionId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}`) || { data: {} }
  return res.data
}

const preProcessHttpClientError = (e) => {
  if (!e.response) {
    throw e
  }
}

const getCustodyDetails = async (crn, convictionId) => {
  let res
  try {
    res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}/sentence/custody`) || { data: undefined }
  } catch (e) {
    logger.error(e, 'Error occurred while getting custody details')
    preProcessHttpClientError(e)
    res = e.response
  }
  return res.data
}

const getProbationRecord = async crn => {
  let res
  try {
    res = await request(`${apiUrl}/offender/${crn}/probation-record`)
  } catch (e) {
    logger.error(e, 'Error occurred while getting probation record')
    preProcessHttpClientError(e)
    res = e.response
  }
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
  let res
  try {
    res = await request(`${apiUrl}/offender/${crn}/probation-status-detail`) || {}
  } catch (e) {
    logger.error(e, 'Error occurred while getting probation status details')
    preProcessHttpClientError(e)
    res = e.response
  }
  return res.status >= 400 ? res : res.data
}

const getRiskDetails = async crn => {
  let res
  try {
    res = await request(`${apiUrl}/offender/${crn}/registrations`) || { data: {} }
  } catch (e) {
    logger.error(e, 'Error occurred while getting registrations')
    preProcessHttpClientError(e)
    return e.response?.data
  }
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
