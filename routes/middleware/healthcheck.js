const axios = require('axios')
const courtCaseServiceUrl = process.env.COURT_CASE_SERVICE_URL

const health = async (req, res, next) => {
  try {
    const response = await axios.get(`${courtCaseServiceUrl}/ping`)
    req.healthy = response && response.status === 200
    next()
  } catch (e) {
    req.healthy = false
    next()
  }
}

module.exports = {
  health
}
