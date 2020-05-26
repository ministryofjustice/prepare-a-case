const express = require('express')
const moment = require('moment')
const { getCaseList, getCase } = require('../services/case-service')
const { getPersonalDetails, getProbationRecord, getProbationRecordWithRequirements, getAttendanceDetails, getBreachDetails } = require('../services/community-service')
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

router.post('/case/:caseNo/record', async (req, res) => {
  req.session.showAllPreviousOrders = req.params.caseNo
  res.redirect(`/case/${req.params.caseNo}/record#previousOrders`)
})

async function getCaseAndTemplateValues (req) {
  const params = req.params
  const response = await getCase(params.courtCode, params.caseNo)
  return {
    healthy: req.healthy,
    params: {
      ...params
    },
    data: {
      ...response
    }
  }
}

router.get('/case/:caseNo/details', health, defaults, async (req, res) => {
  const templateValues = await getCaseAndTemplateValues(req)
  templateValues.title = 'Case details'

  res.render('case-summary', templateValues)
})

router.get('/case/:caseNo/record', health, defaults, async (req, res) => {
  const templateValues = await getCaseAndTemplateValues(req)
  templateValues.title = 'Probation record'

  const crn = templateValues.data.crn
  const communityResponse = await getProbationRecordWithRequirements(crn)
  const personalDetails = await getPersonalDetails(crn)
  templateValues.params.showAllPreviousOrders = req.session.showAllPreviousOrders
  templateValues.data.communityData = {
    ...communityResponse,
    personalDetails
  }
  res.render('case-summary-record', templateValues)
})

router.get('/case/:caseNo/record/:detail?', health, defaults, async (req, res) => {
  const templateValues = await getCaseAndTemplateValues(req)
  templateValues.title = 'Order details'

  const params = req.params
  const crn = templateValues.data.crn

  let communityResponse = await getProbationRecordWithRequirements(crn)

  const { active } = communityResponse.convictions
    .find(conviction => conviction.convictionId.toString() === params.detail.toString())
  if (active) {
    const attendanceDetails = await getAttendanceDetails(crn, params.detail)
    communityResponse = {
      ...communityResponse,
      attendanceDetails
    }
  }
  templateValues.data.communityData = communityResponse || {}
  res.render('case-summary-record-order', templateValues)
})

router.get('/case/:caseNo/record/:convictionId/breach/:breachId', health, defaults, async (req, res) => {
  const templateValues = await getCaseAndTemplateValues(req)
  templateValues.title = 'Breach details'

  const params = req.params
  const crn = templateValues.data.crn
  const communityResponse = await getProbationRecord(crn)

  const breachData = communityResponse.convictions
    .find(conviction => conviction.convictionId.toString() === params.convictionId.toString())
    .breaches.find(breach => breach.breachId.toString() === params.breachId.toString())

  const breachDetails = await getBreachDetails(crn, params.convictionId, params.breachId)
  templateValues.data.communityData = {
    ...breachData,
    ...breachDetails
  }
  res.render('case-summary-record-order-breach', templateValues)
})

router.get('/case/:caseNo/risk', health, defaults, async (req, res) => {
  const templateValues = await getCaseAndTemplateValues(req)
  templateValues.title = 'Risk registers'

  res.render('case-summary-risk', templateValues)
})

module.exports = router
