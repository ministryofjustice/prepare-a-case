const { request, update } = require('./utils/request')
const config = require('../../config')
const apiUrl = config.apis.userPreferenceService.url

const getUserSelectedCourts = async (userId) => {
  const res = await request(`${apiUrl}/users/${userId}/preferences/courts`)
  if (res) {
    return res.status >= 400 ? { isError: true, status: res.status || 500 } : res.data
  }
  return { isError: true, status: 500 }
}

const updateSelectedCourts = async (userId, courts) => {
  return await update(`${apiUrl}/users/${userId}/preferences/courts`, { items: courts })
}

module.exports = {
  getUserSelectedCourts,
  updateSelectedCourts
}
