const { request } = require('./utils/request')
const { apiUrl } = require('../config/defaults')

const getPersonalDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/personal`)
  return res.data
}

const getProbationRecord = async crn => {
  console.log(`Now calling for probation-record: ${apiUrl}/offender/${crn}/probation-record`)
  const res = await request(`${apiUrl}/offender/${crn}/probation-record`)
  return res.data
}

const getAttendanceDetails = async (crn, orderId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${orderId}`)
  return res.data
}

module.exports = {
  getPersonalDetails,
  getProbationRecord: getProbationRecord,
  getAttendanceDetails
}
