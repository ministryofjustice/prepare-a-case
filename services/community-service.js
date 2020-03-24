const { request } = require('./utils/request')
const { apiUrl } = require('../config/defaults')

const getPersonalDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/personal`)
  return res.data
}

const getConvictions = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions`)
  return res.data
}

const getAttendanceDetails = async (crn, orderId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${orderId}`)
  return res.data
}

module.exports = {
  getPersonalDetails,
  getConvictions,
  getAttendanceDetails
}
