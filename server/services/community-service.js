const { request } = require('./utils/request')
const config = require('../../config')

const getPersonalDetails = async crn => {
  const res = await request(`${config.apis.courtCaseService.url}/offender/${crn}/personal`)
  return res.data
}

const getRequirements = async (convictions, crn) => {
  return Promise.all(
    convictions.map(async conviction => {
      if (conviction.sentence) {
        const res = await request(`${config.apis.courtCaseService.url}/offender/${crn}/convictions/${conviction.convictionId}/requirements`)
        return { ...conviction, ...res.data }
      } else {
        return conviction
      }
    })
  )
}

const getProbationRecord = async crn => {
  const res = await request(`${config.apis.courtCaseService.url}/offender/${crn}/probation-record`)
  return res.data
}

const getProbationRecordWithRequirements = async crn => {
  const responseData = await getProbationRecord(crn)
  if (responseData.convictions) {
    const enrichedConvictions = await getRequirements(responseData.convictions, crn)
    return {
      ...responseData,
      convictions: enrichedConvictions
    }
  }
  return responseData
}

const getAttendanceDetails = async (crn, orderId) => {
  const res = await request(`${config.apis.courtCaseService.url}/offender/${crn}/convictions/${orderId}`)
  return res.data
}

const getBreachDetails = async (crn, convictionId, breachId) => {
  const res = await request(`${config.apis.courtCaseService.url}/offender/${crn}/convictions/${convictionId}/breaches/${breachId}`)
  return res.data
}

const getAttachment = async (crn, documentId) => {
  const res = await request(`${config.apis.courtCaseService.url}/offender/${crn}/documents/${documentId}`)
  return res.data
}

module.exports = {
  getPersonalDetails,
  getProbationRecord,
  getProbationRecordWithRequirements,
  getAttendanceDetails,
  getBreachDetails,
  getAttachment
}
