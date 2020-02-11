const express = require('express')
const axios = require('axios')
const moment = require('moment')

const router = express.Router()

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')

router.get('/', health, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', healthy: req.healthy })
})

router.get('/cases/:date', health, defaults, async (req, res) => {
  let response = {}
  try {
    response = await axios.get(`${req.params.apiUrl}/court/${req.params.courtCode}/cases?date=${req.params.date}`)
  } catch (e) {
    console.error(e)
    // Silent as issue should be caught by health middleware and the user should be suitably notified
  }

  const params = req.params
  const totalCount = (response.data && response.data.cases && response.data && response.data.cases.length) || 0
  const startCount = ((parseInt(req.query.page, 10) - 1) || 0) * params.limit
  const endCount = Math.min(startCount + parseInt(params.limit, 10), totalCount)
  const templateValues = {
    title: 'Cases',
    healthy: req.healthy,
    params: {
      page: parseInt(req.query.page, 10) || 1,
      from: startCount,
      to: endCount,
      total: totalCount,
      lastUpdated: response.data ? response.data.lastUpdated : '',
      ...params
    },
    data: (response.data && response.data.cases && response.data.cases.slice(startCount, endCount)) || []
  }
  res.render('case-list', templateValues)
})

router.get('/cases', async (req, res) => {
  res.redirect(`/cases/${moment().format('YYYY-MM-DD')}`)
})

module.exports = router
