const express = require('express')
const { body } = require('express-validator')
const getBaseDateString = require('../utils/getBaseDateString')
const { settings, notification, session: { cookieOptions } } = require('../../config')
const { getUserSelectedCourts, updateSelectedCourts } = require('../services/user-preference-service')
const { getCaseList, getCase, getMatchDetails, updateCase } = require('../services/case-service')
const {
  getDetails,
  getProbationRecord,
  getConviction,
  getProbationStatusDetails,
  getSentenceDetails,
  getBreachDetails,
  getRiskDetails,
  getCustodyDetails
} = require('../services/community-service')

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')

module.exports = function Index ({ authenticationMiddleware }) {
  const router = express.Router()
  router.use(authenticationMiddleware())
  router.use(health)

  router.use((req, res, next) => {
    const { path, url, cookies } = req
    res.locals.analyticsCookies = req.cookies && req.cookies.analyticsCookies

    if (cookies && cookies.currentCourt) {
      res.cookie('currentCourt', cookies.currentCourt, cookieOptions)
    }
    if (cookies && cookies.analyticsCookies) {
      res.cookie('analyticsCookies', cookies.analyticsCookies, cookieOptions)
    }
    if (path.substr(-1) === '/' && path.length > 1) {
      const query = url.slice(path.length)
      res.redirect(301, path.slice(0, -1) + query)
    } else {
      next()
    }
  })

  router.get('/', (req, res) => {
    const { cookies } = req
    // @FIXME: Cookie check and removal to be removed at a later date
    if (cookies && cookies.court) {
      res.clearCookie('court')
    }
    res.redirect(302, cookies && cookies.currentCourt ? `/${cookies.currentCourt}/cases` : '/my-courts/setup')
  })

  router.get('/set-notification', async (req, res) => {
    const { redisClient: { getAsync } } = req
    const currentNotification = await getAsync('case-list-notification')
    const reject = () => {
      res.setHeader('www-authenticate', 'Basic')
      res.sendStatus(401)
    }

    const authorization = req.headers.authorization
    if (!authorization) {
      return reject()
    }

    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')
    if (username !== notification.username || password !== notification.password) {
      return reject()
    }
    res.render('set-notification', { currentNotification: currentNotification })
  })

  router.post('/set-notification', body('notification').trim().escape(), async (req, res) => {
    const { redisClient: { setAsync } } = req
    await setAsync('case-list-notification', req.body.notification, 'EX', 60 * 60 * 12)
    res.redirect(302, '/set-notification')
  })

  router.get('/user-guide', (req, res) => {
    res.render('user-guide')
  })

  router.get('/accessibility-statement', (req, res) => {
    const { session } = req
    res.render('accessibility-statement', { params: { backLink: session.backLink } })
  })

  router.get('/privacy-notice', (req, res) => {
    const { session } = req
    res.render('privacy-notice', { params: { backLink: session.backLink } })
  })

  router.get('/cookies-policy', (req, res) => {
    res.render('cookies-policy', {
      params: {
        saved: req.query.saved,
        preference: req.cookies && req.cookies.analyticsCookies
      }
    })
  })

  router.post('/cookie-preference/:page?', (req, res) => {
    const redirectUrl = req.params.page ? '/cookies-policy?saved=true' : '/'
    if (req.body.cookies) {
      if (req.body.cookies === 'reject') {
        for (const [key] of Object.entries(req.cookies)) {
          if (/^_g/.test(key)) {
            res.clearCookie(key)
          }
        }
      }
      res.cookie('analyticsCookies', req.body.cookies)
        .redirect(302, redirectUrl)
    }
  })

  router.get('/my-courts', async (req, res) => {
    const { session } = req
    const userSelectedCourts = await getUserSelectedCourts(res.locals.user.userId)
    session.courts = userSelectedCourts.items
    res.render('view-courts', {
      params: {
        availableCourts: settings.availableCourts,
        chosenCourts: session.courts
      }
    })
  })

  router.get('/my-courts/:state', async (req, res) => {
    const { params: { state }, query: { error, remove, save }, session } = req
    let formError = error
    let serverError = false
    if (save) {
      if (session.courts && session.courts.length) {
        const updatedCourts = await updateSelectedCourts(res.locals.user.userId, session.courts)
        if (updatedCourts.status >= 400) {
          serverError = true
        } else {
          return res.redirect(302, '/my-courts')
        }
      } else {
        formError = true
      }
    }
    if (remove && session.courts && session.courts.includes(remove)) {
      session.courts.splice(session.courts.indexOf(remove), 1)
      return res.redirect(req.path)
    }
    res.render('edit-courts', {
      formError: formError,
      serverError: serverError,
      state: state,
      params: {
        availableCourts: settings.availableCourts,
        chosenCourts: session.courts
      }
    })
  })

  router.post('/my-courts/:state', (req, res) => {
    const { params: { state }, session, body: { court } } = req
    if (!court) {
      return res.redirect(302, `/my-courts/${state}?error=true`)
    }
    session.courts = session.courts || []
    if (court && !session.courts.includes(court)) {
      session.courts.push(court)
    }
    res.redirect(req.path)
  })

  router.get('/select-court/:courtCode', (req, res) => {
    const { params: { courtCode } } = req

    res.status(201)
      .cookie('currentCourt', courtCode, cookieOptions)
      .redirect(302, `/${courtCode}/cases`)
  })

  router.get('/:courtCode/cases/:date?/:subsection?', defaults, async (req, res) => {
    const {
      redisClient: { getAsync },
      params: { courtCode, date, limit, subsection },
      query: { page },
      session,
      path,
      params
    } = req
    const currentNotification = await getAsync('case-list-notification')
    const currentDate = date || getBaseDateString()
    const response = await getCaseList(courtCode, currentDate, session.selectedFilters, subsection || (!date && session.currentView))
    const caseCount = response.cases.length
    const startCount = ((parseInt(page, 10) - 1) || 0) * limit
    const endCount = Math.min(startCount + parseInt(limit, 10), caseCount)
    const templateValues = {
      title: 'Cases',
      params: {
        ...params,
        date: currentDate,
        notification: currentNotification || '',
        filters: response.filters,
        page: parseInt(page, 10) || 1,
        from: startCount,
        to: endCount,
        totalCount: response.totalCount,
        caseCount: caseCount,
        addedCount: response.addedCount,
        removedCount: response.removedCount,
        unmatchedRecords: response.unmatchedRecords,
        lastUpdated: response ? response.lastUpdated : '',
        totalDays: settings.casesTotalDays,
        subsection: subsection || (!date && session.currentView) || '',
        filtersApplied: session.selectedFilters && Object.keys(session.selectedFilters).length,
        snapshot: response.snapshot
      },
      data: response.cases.slice(startCount, endCount) || []
    }
    session.currentView = subsection
    session.caseListDate = currentDate
    session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
    session.backLink = session.currentCaseListViewLink
    res.render('case-list', templateValues)
  })

  router.post('/:courtCode/cases/:date?/:subsection?', defaults, async (req, res) => {
    const { params: { courtCode, date, subsection }, session, body } = req
    const currentDate = date || getBaseDateString()
    session.selectedFilters = body
    session.courtCode = courtCode
    res.redirect(302, `/${courtCode}/cases/${currentDate}${subsection ? '/' + subsection : ''}`)
  })

  router.post('/:courtCode/case/:caseId/defendant/:defendantId/record', async (req, res) => {
    const { params: { courtCode, caseId, defendantId }, session } = req
    session.showAllPreviousOrders = caseId
    res.redirect(302, `/${courtCode}/case/${caseId}/defendant/${defendantId}/record#previousOrders`)
  })

  async function getCaseAndTemplateValues (req) {
    const { params: { caseId, defendantId }, session, params } = req
    const response = await getCase(caseId, defendantId)
    const caseListDate = session.caseListDate || getBaseDateString()
    return {
      currentCaseListViewLink: session.currentCaseListViewLink,
      backLink: session.backLink,
      caseListDate: caseListDate,
      params: {
        ...params
      },
      data: {
        ...response
      }
    }
  }

  router.get('/:courtCode/case/:caseId/defendant/:defendantId/summary', defaults, async (req, res) => {
    const { session, path } = req
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Case summary'
    templateValues.session = {
      ...session
    }
    session.confirmedMatch = undefined
    session.matchName = undefined
    session.matchType = 'defendant'
    session.matchDate = undefined
    session.backLink = path
    res.render('case-summary', templateValues)
  })

  router.get('/:courtCode/case/:caseId/defendant/:defendantId/record', defaults, async (req, res) => {
    const { session } = req
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Probation record'

    const crn = templateValues.data.crn
    const communityResponse = await getProbationRecord(crn, true)
    templateValues.params.showAllPreviousOrders = session.showAllPreviousOrders
    templateValues.data.communityData = {
      ...communityResponse
    }
    res.render('case-summary-record', templateValues)
  })

  router.get('/:courtCode/case/:caseId/defendant/:defendantId/record/:convictionId?', defaults, async (req, res) => {
    const { params: { convictionId } } = req
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Order details'

    const { data: { crn } } = templateValues
    let communityResponse = await getConviction(crn, convictionId)

    if (communityResponse) {
      const { active } = communityResponse
      if (active) {
        const sentenceDetails = await getSentenceDetails(crn, convictionId)
        const custodyDetails = await getCustodyDetails(crn, convictionId)
        communityResponse = {
          ...communityResponse,
          sentenceDetails,
          custodyDetails: custodyDetails
        }
      }
    }

    templateValues.data.communityData = communityResponse || {}
    res.render('case-summary-record-order', templateValues)
  })

  router.get('/:courtCode/case/:caseId/defendant/:defendantId/record/:convictionId/breach/:breachId', defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Breach details'

    const { params: { convictionId, breachId } } = req
    const { data: { crn } } = templateValues
    const communityResponse = await getProbationRecord(crn)

    const breachData = communityResponse.convictions
      .find(conviction => conviction.convictionId.toString() === convictionId.toString())
      .breaches.find(breach => breach.breachId.toString() === breachId.toString())

    const breachDetails = await getBreachDetails(crn, convictionId, breachId)
    templateValues.data.communityData = {
      ...breachData,
      ...breachDetails
    }
    res.render('case-summary-record-order-breach', templateValues)
  })

  router.get('/:courtCode/case/:caseId/defendant/:defendantId/record/:convictionId/licence-details', defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Licence conditions details'

    const { data: { crn } } = templateValues
    const communityResponse = await getProbationRecord(crn)

    templateValues.data.communityData = communityResponse || {}
    res.render('case-summary-record-order-licence', templateValues)
  })

  router.get('/:courtCode/case/:caseId/defendant/:defendantId/risk', defaults, async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Risk register'

    const { data: { crn } } = templateValues

    templateValues.data.riskData = await getRiskDetails(crn)

    templateValues.params = {
      ...templateValues.params
    }

    res.render('case-summary-risk', templateValues)
  })

  router.get('/:courtCode/match/bulk/:date', defaults, async (req, res) => {
    const { params: { courtCode, date }, session, params } = req
    const response = await getCaseList(courtCode, date)
    const templateValues = {
      title: 'Defendants with possible NDelius records',
      session: {
        ...session
      },
      params: {
        ...params
      },
      data: response.cases
    }
    session.confirmedMatch = undefined
    session.matchName = undefined
    session.matchType = 'bulk'
    session.matchDate = date
    session.courtCode = courtCode
    res.render('match-records', templateValues)
  })

  router.get('/:courtCode/case/:caseId/match/defendant/:defendantId', defaults, async (req, res) => {
    const { params: { caseId, defendantId }, session, path } = req
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Review possible NDelius records'
    const response = await getMatchDetails(caseId, defendantId)
    templateValues.session = {
      ...session
    }
    templateValues.data = {
      ...templateValues.data,
      matchData: response && response.offenderMatchDetails
    }
    session.confirmedMatch = undefined
    session.matchName = templateValues.data.defendantName
    session.formError = false
    session.serverError = false
    session.backLink = path
    res.render('match-defendant', templateValues)
  })

  async function updateCaseDetails (caseId, defendantId, crn, unlinking) {
    const caseResponse = await getCase(caseId, defendantId)
    let offenderDetail
    let probationStatusDetails
    if (crn) {
      offenderDetail = await getDetails(crn)
      probationStatusDetails = await getProbationStatusDetails(crn)
    }
    return await updateCase(caseId, defendantId, {
      ...caseResponse,
      pnc: crn ? offenderDetail.otherIds.pncNumber : caseResponse.pnc || null,
      crn: crn ? offenderDetail.otherIds.crn : null,
      cro: crn ? offenderDetail.otherIds.croNumber : null,
      probationStatus: crn ? probationStatusDetails.status : !unlinking ? 'NO_RECORD' : null,
      probationStatusActual: crn ? probationStatusDetails.status : !unlinking ? 'NO_RECORD' : null,
      awaitingPsr: crn ? probationStatusDetails.awaitingPsr : null,
      breach: crn ? probationStatusDetails.inBreach : null,
      preSentenceActivity: crn ? probationStatusDetails.preSentenceActivity : null
    })
  }

  function getMatchedUrl ($matchType, $matchDate, $caseId, $defendantId, $courtCode) {
    return $matchType === 'bulk' ? $courtCode + '/match/bulk/' + $matchDate : $courtCode + '/case/' + $caseId + '/defendant/' + $defendantId + '/summary'
  }

  router.post('/:courtCode/case/:caseId/match/defendant/:defendantId', defaults, async (req, res) => {
    const { params: { courtCode, caseId, defendantId }, body: { crn }, session } = req
    let redirectUrl = '/'
    if (!crn) {
      session.confirmedMatch = undefined
      session.formError = true
      redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}`
    } else {
      const response = await updateCaseDetails(caseId, defendantId, crn)
      if (response.status === 201) {
        session.confirmedMatch = {
          name: session.matchName,
          matchType: 'Known'
        }
        redirectUrl = `/${getMatchedUrl(session.matchType, session.matchDate, caseId, defendantId, courtCode)}`
      } else {
        session.serverError = true
        redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}`
      }
    }
    res.redirect(302, redirectUrl)
  })

  router.get('/:courtCode/case/:caseId/match/defendant/:defendantId/nomatch/:unlink?', defaults, async (req, res) => {
    const { params: { courtCode, caseId, defendantId, unlink }, session } = req
    let redirectUrl = '/'
    const response = await updateCaseDetails(caseId, defendantId, undefined, !!unlink)
    if (response.status === 201) {
      session.confirmedMatch = {
        name: session.matchName,
        matchType: unlink ? 'unlinked' : 'No record'
      }
      redirectUrl = `/${getMatchedUrl(session.matchType, session.matchDate, caseId, defendantId, courtCode)}`
    } else {
      req.session.serverError = true
      redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}`
    }
    res.redirect(302, redirectUrl)
  })

  router.get('/:courtCode/case/:caseId/match/defendant/:defendantId/manual', defaults, async (req, res) => {
    const { session } = req
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Link an NDelius record to the defendant'
    templateValues.session = {
      ...session
    }
    templateValues.data = {
      ...templateValues.data
    }

    templateValues.data.manualMatch = true

    res.render('match-manual', templateValues)
  })

  router.post('/:courtCode/case/:caseId/match/defendant/:defendantId/manual', body('crn').trim().escape(), defaults, async (req, res) => {
    const { params: { courtCode, caseId, defendantId }, body: { crn }, session } = req
    let redirectUrl = '/'
    session.serverError = false
    session.formError = false
    session.formInvalid = false
    session.crnInvalid = false
    session.confirmedMatch = undefined
    session.matchName = undefined
    if (!crn) {
      session.formError = true
      redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}/manual`
    } else if (!req.body.crn.match(/^[A-Za-z][0-9]{6}$/)) {
      session.formError = true
      session.formInvalid = true
      redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}/manual`
    } else {
      const detailResponse = await getDetails(crn)
      if (detailResponse.status >= 400) {
        session.crn = req.body.crn
        session.status = detailResponse.status
        session.formError = true
        session.crnInvalid = true
        redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}/manual`
      } else {
        redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}/confirm/${crn}`
      }
    }
    res.redirect(302, redirectUrl)
  })

  router.get('/:courtCode/case/:caseId/match/defendant/:defendantId/confirm/:crn', defaults, async (req, res) => {
    const { params: { crn }, session } = req
    const templateValues = await getCaseAndTemplateValues(req)
    const detailResponse = await getDetails(crn)
    const probationStatusDetails = await getProbationStatusDetails(crn)
    templateValues.title = 'Link an NDelius record to the defendant'
    templateValues.details = {
      ...detailResponse,
      probationStatus: probationStatusDetails.status && probationStatusDetails.status.replace('_', ' ')
    }
    templateValues.session = {
      ...session
    }
    session.matchName = templateValues.data.defendantName
    res.render('match-manual', templateValues)
  })

  router.post('/:courtCode/case/:caseId/match/defendant/:defendantId/confirm', body('crn').trim().escape(), defaults, async (req, res) => {
    const { params: { courtCode, caseId, defendantId }, body: { crn }, session } = req
    session.serverError = false
    let redirectUrl = '/'
    const response = await updateCaseDetails(caseId, defendantId, crn)
    if (response.status === 201) {
      session.confirmedMatch = {
        name: session.matchName,
        matchType: 'linked',
        probationStatus: response.data.probationStatus
      }
      redirectUrl = `/${getMatchedUrl(session.matchType, session.matchDate, caseId, defendantId, courtCode)}`
    } else {
      session.serverError = true
      redirectUrl = `/${courtCode}/case/${caseId}/match/defendant/${defendantId}/confirm`
    }
    res.redirect(302, redirectUrl)
  })

  router.get('/:courtCode/case/:caseId/match/defendant/:defendantId/unlink/:crn', defaults, async (req, res) => {
    const { params: { courtCode, caseId, defendantId, crn }, session } = req
    const templateValues = await getCaseAndTemplateValues(req)
    const detailResponse = await getDetails(crn)
    templateValues.title = 'Unlink NDelius record from the defendant'
    templateValues.hideSubnav = true
    templateValues.backText = 'Back'
    templateValues.backLink = `/${courtCode}/case/${caseId}/defendant/${defendantId}/summary`
    templateValues.hideUnlinkButton = true
    templateValues.params = {
      ...templateValues.params
    }
    templateValues.details = {
      ...detailResponse
    }
    session.matchName = templateValues.data.defendantName
    res.render('match-unlink', templateValues)
  })

  return router
}
