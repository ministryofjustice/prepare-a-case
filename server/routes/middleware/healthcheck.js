const axios = require('axios')

const health = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.COURT_CASE_SERVICE_URL || 'http://localhost:8080'}/ping`)
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
