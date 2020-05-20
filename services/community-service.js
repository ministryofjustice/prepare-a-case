const { request } = require('./utils/request')
const { apiUrl } = require('../config/defaults')

const getPersonalDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/personal`)
  return res.data
}

const getRequirements = async (convictions, crn) => {
  return Promise.all(
    convictions.map(async conviction => {
      if (conviction.sentence) {
        const res = await request(`${apiUrl}/offender/${crn}/convictions/${conviction.convictionId}/requirements`)
        return { ...conviction, ...res.data }
      } else {
        return conviction
      }
    })
  )
}

const getProbationRecord = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/probation-record`)
  if (res.data && res.data.convictions) {
    const enrichedConvictions = await getRequirements(res.data.convictions, crn)
    return {
      ...res.data,
      convictions: enrichedConvictions
    }
  }
  return res.data
}

const getAttendanceDetails = async (crn, orderId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${orderId}`)
  return res.data
}

const getBreachDetails = async (crn, breachId) => {
  const res = await request(`${apiUrl}/offender/${crn}/breaches/${breachId}`)
  return res.data
}

const getAttachment = async (crn, documentId) => {
  const res = await request(`${apiUrl}/offender/${crn}/documents/${documentId}`)
  return res.data
}

module.exports = {
  getPersonalDetails,
  getProbationRecord,
  getAttendanceDetails,
  getBreachDetails,
  getAttachment
}
