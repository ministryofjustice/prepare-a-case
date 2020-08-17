const axios = require('axios')
const axiosError = require('./axios-error')

const request = async url => {
  let response = {}
  try {
    response = await axios.get(url)
  } catch (e) {
    axiosError(e)
    // Silent as issue should be caught by health middleware and the user should be suitably notified
  }
  return response
}

const update = async (url, data) => {
  let response = {}
  try {
    response = await axios.put(url, data)
  } catch (e) {
    axiosError(e)
  }
  return response
}

module.exports = {
  request,
  update
}
