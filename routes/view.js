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
    // Silent as issue should be caught by health middleware
  }

  req.params = {
    lastUpdated: response.data && response.data.lastUpdated || "",
    ...req.params
  }

  const templateValues = { 
    title: 'Cases', 
    healthy: req.healthy, 
    params: req.params, 
    data: (response.data && response.data.cases) || [] 
  }
  res.render('case-list', templateValues)
})

router.get('/cases', async (req, res) => {
  res.redirect(`/cases/${moment().format('YYYY-MM-DD')}`)
})

module.exports = router
