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
    // Silent as issue should be caught by health middleware and the user should be suitably notified
  }
  const totalCount = (response.data && response.data.cases && response.data && response.data.cases.length) || 0
  const startCount = ((req.query.page - 1) || 0) * req.params.limit
  const endCount = Math.min(startCount + parseInt(req.params.limit, 10), totalCount)
  req.params = { ...req.params, page: req.query.page || 1, from: startCount, to: endCount, total: totalCount }
  res.render('case-list', { title: 'Cases', healthy: req.healthy, params: req.params, data: (response.data && response.data.cases && response.data.cases.slice(startCount, endCount)) || [] })
})

router.get('/cases', async (req, res) => {
  res.redirect(`/cases/${moment().format('YYYY-MM-DD')}`)
})

module.exports = router
