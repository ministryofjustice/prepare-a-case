const { request } = require('./utils/request')
const { apiUrl } = require('../config/defaults')

const getPersonalDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/personal`)
  return res.data
}

const getRequirements = async (convictions, crn) => {
  return Promise.all(
    convictions.map(async conviction => {
      if (conviction.active && conviction.sentence) {
        console.log(`Now calling for requirements: ${apiUrl}/offender/${crn}/convictions/${conviction.convictionId}/requirements`)
        const res = await request(`${apiUrl}/offender/${crn}/convictions/${conviction.convictionId}/requirements`)
        return { ...conviction, ...res.data }
      } else {
        return conviction
      }
    })
  )
}

const getProbationRecord = async crn => {
  console.log(`Now calling for probation-record: ${apiUrl}/offender/${crn}/probation-record`)
  const res = await request(`${apiUrl}/offender/${crn}/probation-record`)
  if (res.data && res.data.convictions) {
    const enrichedConvictions = await getRequirements(res.data.convictions, crn)
    return {
      convictions: enrichedConvictions
    }
  }
  return res.data
}

const getAttendanceDetails = async (crn, orderId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${orderId}`)
  return res.data
}

module.exports = {
  getPersonalDetails,
  getProbationRecord,
  getAttendanceDetails
}
