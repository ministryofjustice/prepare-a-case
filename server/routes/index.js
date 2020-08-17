const express = require('express')
const moment = require('moment')
const { settings } = require('../../config')
const { getCaseList, getCase, getMatchDetails, updateCase } = require('../services/case-service')
const { getProbationRecord, getProbationRecordWithRequirements, getSentenceDetails, getBreachDetails } = require('../services/community-service')

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')
const { filters } = require('./middleware/filters')

module.exports = function Index ({ authenticationMiddleware }) {
  const router = express.Router()
  router.use(authenticationMiddleware())

  router.get('/', health, (req, res) => {
    res.redirect('/cases')
  })

  router.get('/cases', (req, res) => {
    res.redirect(`/cases/${moment().format('YYYY-MM-DD')}${req.session.currentView ? '/' + req.session.currentView : ''}`)
  })

  router.get('/cases/:date/:subsection?', health, defaults, filters, async (req, res) => {
    const params = req.params
    const response = await getCaseList(params.courtCode, params.date, params.filters, params.subsection)
    const caseCount = response.cases.length
    const startCount = ((parseInt(req.query.page, 10) - 1) || 0) * params.limit
    const endCount = Math.min(startCount + parseInt(params.limit, 10), caseCount)
    const templateValues = {
      title: 'Cases',
      healthy: req.healthy,
      params: {
        page: parseInt(req.query.page, 10) || 1,
        from: startCount,
        to: endCount,
        totalCount: response.totalCount,
        caseCount: caseCount,
        addedCount: response.addedCount,
        removedCount: response.removedCount,
        unmatchedRecords: response.unmatchedRecords,
        lastUpdated: response ? response.lastUpdated : '',
        totalDays: settings.casesTotalDays,
        ...params,
        subsection: params.subsection || ''
      },
      data: response.cases.slice(startCount, endCount) || []
    }
    req.session.currentView = params.subsection
    req.session.caseListDate = params.date
    res.render('case-list', templateValues)
  })

  router.post('/cases/:date/:subsection?', health, defaults, async (req, res) => {
    req.session.selectedFilters = req.body
    res.redirect(`/cases/${req.params.date}${req.params.subsection ? '/' + req.params.subsection : ''}`)
  })

  router.post('/case/:caseNo/record', async (req, res) => {
    req.session.showAllPreviousOrders = req.params.caseNo
    res.redirect(`/case/${req.params.caseNo}/record#previousOrders`)
  })

  async function getCaseAndTemplateValues (req) {
    const params = req.params
    const response = await getCase(params.courtCode, params.caseNo)
    const caseListDate = req.session.caseListDate
    return {
      healthy: req.healthy,
      caseListDate,
      params: {
        ...params
      },
      data: {
        ...response
      }
    }
  }

  router.get('/case/:caseNo/summary', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Case summary'
    templateValues.session = {
      ...req.session
    }
    req.session.confirmedMatch = undefined
    req.session.matchName = undefined
    req.session.matchType = 'defendant'
    req.session.matchDate = undefined
    res.render('case-summary', templateValues)
  })

  router.get('/case/:caseNo/record', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Probation record'

    const crn = templateValues.data.crn
    const communityResponse = await getProbationRecordWithRequirements(crn)
    templateValues.params.showAllPreviousOrders = req.session.showAllPreviousOrders
    templateValues.data.communityData = {
      ...communityResponse
    }
    res.render('case-summary-record', templateValues)
  })

  router.get('/case/:caseNo/record/:convictionId?', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Order details'

    const params = req.params
    const crn = templateValues.data.crn

    let communityResponse = await getProbationRecordWithRequirements(crn)

    const { active, sentence } = communityResponse.convictions
      .find(conviction => conviction.convictionId.toString() === params.convictionId.toString())
    if (active) {
      const sentenceDetails = await getSentenceDetails(crn, params.convictionId, sentence.sentenceId)
      communityResponse = {
        ...communityResponse,
        sentenceDetails
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
    templateValues.title = 'Risk register'

    res.render('case-summary-risk', templateValues)
  })

  router.get('/match/bulk/:date', health, defaults, async (req, res) => {
    const params = req.params
    const response = await getCaseList(params.courtCode, params.date)
    const templateValues = {
      title: 'Defendants with possible nDelius records',
      session: {
        ...req.session
      },
      params: {
        ...params
      },
      data: response.cases
    }
    req.session.confirmedMatch = undefined
    req.session.matchName = undefined
    req.session.matchType = 'bulk'
    req.session.matchDate = params.date
    res.render('match-records', templateValues)
  })

  router.get('/match/defendant/:caseNo', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Review possible nDelius records'
    const response = await getMatchDetails(req.params.courtCode, req.params.caseNo)
    templateValues.session = {
      ...req.session
    }
    templateValues.data = {
      ...templateValues.data,
      matchData: response && response.offenderMatchDetails
    }
    req.session.confirmedMatch = undefined
    req.session.matchName = templateValues.data.defendantName
    req.session.formError = false
    req.session.serverError = false
    res.render('match-defendant', templateValues)
  })

  async function updateCaseDetails (courtCode, caseNo, crn) {
    const caseResponse = await getCase(courtCode, caseNo)
    let matchResponse
    let selectedMatch
    if (crn) {
      matchResponse = await getMatchDetails(courtCode, caseNo)
      selectedMatch = matchResponse.offenderMatchDetails.filter($item => $item.matchIdentifiers.crn === crn)[0]
    }
    return await updateCase(courtCode, caseNo, {
      ...caseResponse,
      pnc: crn ? selectedMatch.matchIdentifiers.pnc : caseResponse.pnc,
      crn: crn ? selectedMatch.matchIdentifiers.crn : null,
      cro: crn ? selectedMatch.matchIdentifiers.cro : null,
      probationStatus: crn ? selectedMatch.probationStatus : 'No record'
    })
  }

  function getMatchedUrl ($matchType, $matchDate, $caseNo) {
    return $matchType === 'bulk' ? '/match/bulk/' + $matchDate : '/case/' + $caseNo + '/summary'
  }

  router.post('/match/defendant/:caseNo', defaults, async (req, res) => {
    let redirectUrl = '/'
    if (!req.body.crn) {
      req.session.confirmedMatch = undefined
      req.session.formError = true
      redirectUrl = '/match/defendant/' + req.params.caseNo
    } else {
      const response = await updateCaseDetails(req.params.courtCode, req.params.caseNo, req.body.crn)
      if (response.status === 201) {
        req.session.confirmedMatch = {
          name: req.session.matchName,
          probationStatus: response.data.probationStatus
        }
        redirectUrl = getMatchedUrl(req.session.matchType, req.session.matchDate, req.params.caseNo)
      } else {
        req.session.serverError = true
        redirectUrl = '/match/defendant/' + req.params.caseNo
      }
    }
    res.redirect(redirectUrl)
  })

  router.get('/match/defendant/:caseNo/nomatch', defaults, async (req, res) => {
    let redirectUrl = '/'
    const response = await updateCaseDetails(req.params.courtCode, req.params.caseNo, undefined)
    if (response.status === 201) {
      req.session.confirmedMatch = {
        name: req.session.matchName,
        probationStatus: 'No record'
      }
      redirectUrl = getMatchedUrl(req.session.matchType, req.session.matchDate, req.params.caseNo)
    } else {
      req.session.serverError = true
      redirectUrl = '/match/defendant/' + req.params.caseNo
    }
    res.redirect(redirectUrl)
  })

  return router
}
