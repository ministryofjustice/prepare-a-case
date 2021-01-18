const axios = require('axios')
const axiosError = require('./axios-error')

const request = async url => {
  let response = {}
  try {
    response = await axios.get(url, { headers: { Accept: 'application/json' } })
  } catch (e) {
    axiosError(e)
    return e.response
  }
  return response
}

const requestFile = async url => {
  let response
  try {
    response = await axios.get(url, {
      responseType: 'stream'
    })
  } catch (e) {
    axiosError(e)
  }
  return response
}

const update = async (url, data) => {
  let response = {}
  try {
    response = await axios.put(url, data, { headers: { Accept: 'application/json' } })
  } catch (e) {
    axiosError(e)
  }
  return response
}

module.exports = {
  request,
  requestFile,
  update
}
