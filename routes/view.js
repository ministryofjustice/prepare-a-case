const express = require('express')
const moment = require('moment')
const { getCaseList, getCase } = require('../services/case-service')
const { getPersonalDetails, getProbationRecord, getAttendanceDetails } = require('../services/community-service')
const router = express.Router()

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')
const { filters } = require('./middleware/filters')

router.get('/', health, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', healthy: req.healthy })
})

router.get('/cases/:date', health, defaults, filters, async (req, res) => {
  const params = req.params
  const response = await getCaseList(params.courtCode, params.date, req.params.filters)
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

router.post('/cases/:date', health, defaults, async (req, res) => {
  req.session.selectedFilters = req.body
  res.redirect(`/cases/${req.params.date}`)
})

router.get('/cases', (req, res) => {
  res.redirect(`/cases/${moment().format('YYYY-MM-DD')}`)
})

router.get('/case/:caseNo/:section?/:detail?', health, defaults, async (req, res) => {
  let template
  let communityResponse = {}
  const params = req.params
  const response = await getCase(params.courtCode, params.caseNo)
  const templateValues = {
    healthy: req.healthy,
    params: {
      ...params
    },
    data: {
      ...response
    }
  }
  switch (params.section) {
    case 'record':
      templateValues.title = params.detail ? 'Order details' : 'Probation record'
      template = !params.detail ? 'case-summary-record' : 'case-summary-record-attendance'
      if (response && response.crn) {
        communityResponse = await getProbationRecord(response.crn)
        if (!params.detail) {
          const personalDetails = await getPersonalDetails(response.crn)
          communityResponse = {
            ...communityResponse,
            personalDetails
          }
        } else {
          const attendanceDetails = await getAttendanceDetails(response.crn, params.detail)
          communityResponse = {
            ...communityResponse,
            attendanceDetails
          }
        }
      }
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
})

module.exports = router
