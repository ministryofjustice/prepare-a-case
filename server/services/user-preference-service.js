const { request, update } = require('./utils/request')
const config = require('../../config')
const apiUrl = config.apis.userPreferenceService.url

const getUserSelectedCourts = async () => {
  const res = await request(`${apiUrl}/courts`) || { data: {} }
  return res.status >= 400 ? res : res.data
}

const updateSelectedCourts = async courts => {
  return await update(`${apiUrl}/courts`, courts.join(','))
}

module.exports = {
  getUserSelectedCourts,
  updateSelectedCourts
}
