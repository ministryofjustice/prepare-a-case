const apiUrl = require('../config').services.userPreferences.url
const UserPreferenceServiceError = require('./utils/UserPreferenceServiceError')
const requestor = require('./utils/request')(UserPreferenceServiceError)

module.exports = (token, userId) => {

  const { getJSON, putJSON } = requestor(token)

  getUserSelectedCourts: () => getJSON({}, `${apiUrl}/users/${userId}/preferences/courts`),

  // WARN: the userId looks suspicious, it should be getting this from the JWT
  updateSelectedCourts: items => putJSON({}, `${apiUrl}/users/${userId}/preferences/courts`, { items })
}