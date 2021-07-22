const axios = require('axios')
const axiosError = require('axios-error')
const { defaultTimeout } = require('../../../config')

const fileRequest = async url => {
  let response = {}
  try {
    response = await axios.get(url, { timeout: defaultTimeout })
  } catch (e) {
    axiosError(e)
  }
  return response
}

module.exports = {
  fileRequest
}
