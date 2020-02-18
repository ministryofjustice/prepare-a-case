const express = require('express')
const moment = require('moment')
const { getCaseList, getCase } = require('../services/case-service')
const { getPersonalDetails } = require('../services/community-service')
const router = express.Router()

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')

router.get('/', health, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', healthy: req.healthy })
})

router.get('/cases/:date', health, defaults, async (req, res) => {
  const response = await getCaseList(req.params.courtCode, req.params.date)
  const params = req.params
  const totalCount = (response && response.cases && response.cases.length) || 0
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
      lastUpdated: response ? response.lastUpdated : '',
      ...params
    },
    data: (response && response.cases && response.cases.slice(startCount, endCount)) || []
  }
  res.render('case-list', templateValues)
})

router.get('/cases', (req, res) => {
  res.redirect(`/cases/${moment().format('YYYY-MM-DD')}`)
})

router.get('/case/:caseNo/:detail', health, defaults, async (req, res) => {
  let template
  let communityResponse = {}
  const response = await getCase(req.params.courtCode, req.params.caseNo)
  const templateValues = {
    healthy: req.healthy,
    params: {
      ...req.params
    },
    data: {
      ...response
    }
  }
  switch (req.params.detail) {
    case 'person':
      templateValues.title = 'Person'
      template = 'case-summary-person'
      if (response && response.crn) {
        communityResponse = await getPersonalDetails(response.crn)
      }
      break
    case 'record':
      templateValues.title = 'Probation record'
      template = 'case-summary-record'
      break
    case 'risk':
      templateValues.title = 'Risk registers'
      template = 'case-summary-risk'
      break
    default:
      templateValues.title = 'Case details'
      template = 'case-summary'
  }
  templateValues.data.caseData = response && response.data ? JSON.parse(response.data) : {}
  templateValues.data.communityData = communityResponse || {}
  res.render(template, templateValues)
}, defaults)

module.exports = router
