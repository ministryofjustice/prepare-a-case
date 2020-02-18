const axios = require('axios')

const request = async (url) => {
  let response = {}
  try {
    response = await axios.get(url)
  } catch (e) {
    console.error(e)
    // Silent as issue should be caught by health middleware and the user should be suitably notified
  }
  return response
}

module.exports = {
  request
}
