const express = require('express')
const getBaseDateString = require('../utils/getBaseDateString')
const getCaseListFilters = require('../utils/getCaseListFilters')
const { settings } = require('../../config')
const { getCaseList, getCase, getMatchDetails, updateCase } = require('../services/case-service')
const {
  getDetails,
  getProbationRecord,
  getProbationRecordWithRequirements,
  getSentenceDetails,
  getBreachDetails,
  getRiskDetails
} = require('../services/community-service')

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')

module.exports = function Index ({ authenticationMiddleware }) {
  const router = express.Router()
  router.use(authenticationMiddleware())

  router.get('/', health, (req, res) => {
    res.redirect(req.cookies && req.cookies.court ? `/${req.cookies.court}/cases` : '/select-court')
  })

  router.get('/select-court/:selectedCourt?', (req, res) => {
    if (req.params.selectedCourt) {
      res.cookie('court', req.params.selectedCourt).send()
      res.redirect(`/${req.params.selectedCourt}/cases/${getBaseDateString()}`)
    } else {
      res.render('select-court', { title: 'Select court', params: { courtCode: req.cookies.court } })
    }
  })

  router.get('/:courtCode/cases', (req, res) => {
    res.redirect(`/${req.params.courtCode}/cases/${getBaseDateString()}${req.session.currentView ? '/' + req.session.currentView : ''}`)
  })

  router.get('/:courtCode/cases/:date/:subsection?', health, defaults, async (req, res) => {
    const params = req.params
    const response = await getCaseList(params.courtCode, params.date, params.filters, params.subsection)
    const caseCount = response.cases.length
    const startCount = ((parseInt(req.query.page, 10) - 1) || 0) * params.limit
    const endCount = Math.min(startCount + parseInt(params.limit, 10), caseCount)
    const templateValues = {
      title: 'Cases',
      healthy: req.healthy,
      params: {
        ...params,
        filters: getCaseListFilters(response.cases, req.session.selectedFilters),
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
        subsection: params.subsection || '',
        filtersApplied: req.session.selectedFilters && Object.keys(req.session.selectedFilters).length
      },
      data: response.cases.slice(startCount, endCount) || []
    }
    req.session.currentView = params.subsection
    req.session.caseListDate = params.date
    req.session.backLink = `/${params.courtCode}/cases/${params.date}?page=${templateValues.params.page}`
    res.render('case-list', templateValues)
  })

  router.post('/:courtCode/cases/:date/:subsection?', health, defaults, async (req, res) => {
    req.session.selectedFilters = req.body
    res.redirect(`/${req.params.courtCode}/cases/${req.params.date}${req.params.subsection ? '/' + req.params.subsection : ''}`)
  })

  router.post('/:courtCode/case/:caseNo/record', async (req, res) => {
    req.session.showAllPreviousOrders = req.params.caseNo
    res.redirect(`/${req.params.courtCode}/case/${req.params.caseNo}/record#previousOrders`)
  })

  async function getCaseAndTemplateValues (req) {
    const params = req.params
    const response = await getCase(params.courtCode, params.caseNo)
    const caseListDate = req.session.caseListDate || getBaseDateString()
    return {
      backLink: req.session.backLink,
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

  router.get('/:courtCode/case/:caseNo/summary', health, defaults, async (req, res) => {
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

  router.get('/:courtCode/case/:caseNo/record', health, defaults, async (req, res) => {
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

  router.get('/:courtCode/case/:caseNo/record/:convictionId?', health, defaults, async (req, res) => {
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

  router.get('/:courtCode/case/:caseNo/record/:convictionId/breach/:breachId', health, defaults, async (req, res) => {
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

  router.get('/:courtCode/case/:caseNo/risk', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Risk register'

    const crn = templateValues.data.crn

    templateValues.data.riskData = await getRiskDetails(crn)

    templateValues.params = {
      ...templateValues.params
    }

    res.render('case-summary-risk', templateValues)
  })

  router.get('/:courtCode/match/bulk/:date', health, defaults, async (req, res) => {
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

  router.get('/:courtCode/match/defendant/:caseNo', health, defaults, async (req, res) => {
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
    let offenderDetail
    if (crn) {
      offenderDetail = await getDetails(crn)
    }
    return await updateCase(courtCode, caseNo, {
      ...caseResponse,
      pnc: crn ? offenderDetail.otherIds.pnc : caseResponse.pnc,
      crn: crn ? offenderDetail.otherIds.crn : null,
      cro: crn ? offenderDetail.otherIds.cro : null,
      probationStatus: crn ? offenderDetail.probationStatus : 'No record'
    })
  }

  function getMatchedUrl ($matchType, $matchDate, $caseNo) {
    return $matchType === 'bulk' ? '/match/bulk/' + $matchDate : '/case/' + $caseNo + '/summary'
  }

  router.post('/:courtCode/match/defendant/:caseNo', defaults, async (req, res) => {
    let redirectUrl = '/'
    if (!req.body.crn) {
      req.session.confirmedMatch = undefined
      req.session.formError = true
      redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}`
    } else {
      const response = await updateCaseDetails(req.params.courtCode, req.params.caseNo, req.body.crn)
      if (response.status === 201) {
        req.session.confirmedMatch = {
          name: req.session.matchName,
          matchType: 'Known'
        }
        redirectUrl = `/${req.params.courtCode}${getMatchedUrl(req.session.matchType, req.session.matchDate, req.params.caseNo)}`
      } else {
        req.session.serverError = true
        redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}`
      }
    }
    res.redirect(redirectUrl)
  })

  router.get('/:courtCode/match/defendant/:caseNo/nomatch/:unlink?', defaults, async (req, res) => {
    let redirectUrl = '/'
    const response = await updateCaseDetails(req.params.courtCode, req.params.caseNo, undefined)
    if (response.status === 201) {
      req.session.confirmedMatch = {
        name: req.session.matchName,
        matchType: req.params.unlink ? 'unlinked' : 'No record'
      }
      redirectUrl = `/${req.params.courtCode}${getMatchedUrl(req.session.matchType, req.session.matchDate, req.params.caseNo)}`
    } else {
      req.session.serverError = true
      redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}`
    }
    res.redirect(redirectUrl)
  })

  router.get('/:courtCode/match/defendant/:caseNo/manual', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Link an nDelius record to the defendant'
    templateValues.session = {
      ...req.session
    }
    res.render('match-manual', templateValues)
  })

  router.post('/:courtCode/match/defendant/:caseNo/manual', defaults, async (req, res) => {
    let redirectUrl = '/'
    req.session.serverError = false
    req.session.formError = false
    req.session.formInvalid = false
    req.session.crnInvalid = false
    req.session.confirmedMatch = undefined
    req.session.matchName = undefined
    if (!req.body.crn) {
      req.session.formError = true
      redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}/manual`
    } else if (!req.body.crn.match(/[A-Za-z][0-9]{6}/)) {
      req.session.formError = true
      req.session.formInvalid = true
      redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}/manual`
    } else {
      const detailResponse = await getDetails(req.body.crn)
      if (!detailResponse) {
        req.session.crn = req.body.crn
        req.session.formError = true
        req.session.crnInvalid = true
        redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}/manual`
      } else {
        redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}/confirm/${req.body.crn}`
      }
    }
    res.redirect(redirectUrl)
  })

  router.get('/:courtCode/match/defendant/:caseNo/confirm/:crn', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    const detailResponse = await getDetails(req.params.crn)
    templateValues.title = 'Link an nDelius record to the defendant'
    templateValues.details = {
      ...detailResponse
    }
    templateValues.session = {
      ...req.session
    }
    req.session.matchName = templateValues.data.defendantName
    res.render('match-manual', templateValues)
  })

  router.post('/:courtCode/match/defendant/:caseNo/confirm', defaults, async (req, res) => {
    req.session.serverError = false
    let redirectUrl = '/'
    const response = await updateCaseDetails(req.params.courtCode, req.params.caseNo, req.body.crn)
    if (response.status === 201) {
      req.session.confirmedMatch = {
        name: req.session.matchName,
        matchType: 'linked',
        probationStatus: response.data.probationStatus
      }
      redirectUrl = `/${req.params.courtCode}${getMatchedUrl(req.session.matchType, req.session.matchDate, req.params.caseNo)}`
    } else {
      req.session.serverError = true
      redirectUrl = `/${req.params.courtCode}/match/defendant/${req.params.caseNo}/confirm`
    }
    res.redirect(redirectUrl)
  })

  router.get('/:courtCode/match/defendant/:caseNo/unlink/:crn', health, defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    const detailResponse = await getDetails(req.params.crn)
    templateValues.title = 'Unlink nDelius record from the defendant'
    templateValues.hideSubnav = true
    templateValues.backText = 'Back'
    templateValues.backLink = `/${req.params.courtCode}/case/${req.params.caseNo}/summary`
    templateValues.hideUnlinkButton = true
    templateValues.params = {
      ...templateValues.params
    }
    templateValues.details = {
      ...detailResponse
    }
    req.session.matchName = templateValues.data.defendantName
    res.render('match-unlink', templateValues)
  })

  return router
}
