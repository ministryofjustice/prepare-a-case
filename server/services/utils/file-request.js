const axios = require('axios')
const { axiosError } = require('axios-error')

const fileRequest = async url => {
  let response = {}
  try {
    response = await axios.get(url)
  } catch (e) {
    axiosError(e)
    // Silent as issue should be caught by health middleware and the user should be suitably notified
  }
  return response
}

module.exports = {
  fileRequest
}
