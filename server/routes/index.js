const express = require('express')
const { body } = require('express-validator')
const getBaseDateString = require('../utils/getBaseDateString')
const { settings, notification, session: { cookieOptions }, features: { sendPncAndCroWithOffenderUpdates } } = require('../../config')
const { updateSelectedCourts } = require('../services/user-preference-service')
const { getCaseList, getMatchDetails, deleteOffender, updateOffender, getCaseHistory } = require('../services/case-service')
const { getDetails, getProbationRecord, getConviction, getProbationStatusDetails, getSentenceDetails, getBreachDetails, getRiskDetails, getCustodyDetails } = require('../services/community-service')
const { getOrderTitle } = require('./helpers')
const featuresToggles = require('../utils/features')
const getNextHearing = require('../utils/getNextHearing')

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')
const {
  getCaseListHandler,
  getCaseAndTemplateValues,
  getProbationRecordHandler,
  getUserSelectedCourtsHandler,
  addCaseCommentRequestHandler,
  deleteCaseCommentConfirmationHandler,
  deleteCaseCommentHandler,
  addHearingNoteRequestHandler
} = require('../routes/handlers')
const catchErrors = require('./handlers/catchAsyncErrors')
const moment = require('moment')
const { deleteHearingNoteConfirmationHandler, deleteHearingNoteHandler } = require('./handlers')

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

  router.get('/set-notification', catchErrors(async (req, res) => {
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
    res.render('set-notification', { currentNotification })
  }))

  router.post('/set-notification', body('notification').trim().escape(), catchErrors(async (req, res) => {
    const { redisClient: { setAsync } } = req
    await setAsync('case-list-notification', req.body.notification, 'EX', 60 * 60 * (parseInt(req.body.expires, 10)))
    res.redirect(302, '/set-notification')
  }))

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

  router.get('/my-courts', catchErrors(getUserSelectedCourtsHandler))

  router.get('/my-courts/:state', catchErrors(async (req, res) => {
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
      formError,
      serverError,
      state,
      params: {
        availableCourts: settings.availableCourts,
        chosenCourts: session.courts
      }
    })
  }))

  router.post('/my-courts/:state', catchErrors((req, res) => {
    const { params: { state }, session, body: { court } } = req
    if (!court) {
      return res.redirect(302, `/my-courts/${state}?error=true`)
    }
    session.courts = session.courts || []
    if (court && !session.courts.includes(court)) {
      session.courts.push(court)
    }
    res.redirect(req.path)
  }))

  router.get('/select-court/:courtCode', catchErrors((req, res) => {
    const { params: { courtCode } } = req

    res.status(201)
      .cookie('currentCourt', courtCode, cookieOptions)
      .redirect(302, `/${courtCode}/cases`)
  }))

  router.get('/:courtCode/cases/:caseId/history', defaults, catchErrors(async (req, res) => {
    const data = await getCaseHistory(req.params.caseId)
    res.render('case-history', { caseId: data.caseId, params: req.params, data: JSON.stringify(data, null, 2) })
  }))

  router.get('/:courtCode/cases/:date?/:subsection?', defaults, catchErrors(getCaseListHandler))

  router.post('/:courtCode/cases/:date?/:subsection?', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, date, subsection }, session, body } = req
    const currentDate = date || getBaseDateString()
    session.selectedFilters = body
    session.courtCode = courtCode
    res.redirect(302, `/${courtCode}/cases/${currentDate}${subsection ? '/' + subsection : ''}`)
  }))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/record', catchErrors(async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session } = req
    session.showAllPreviousOrders = hearingId
    res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/record#previousOrders`)
  }))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary', defaults, catchErrors(async (req, res) => {
    const { session, path, params: { courtCode } } = req
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Case summary'
    templateValues.session = {
      ...session
    }
    session.deleteCommentSuccess = undefined
    session.deleteHearingNoteSuccess = undefined
    templateValues.data.caseComments = templateValues.data.caseComments?.sort((a, b) => {
      return moment(b.created).unix() - moment(a.created).unix()
    })
    templateValues.data.nextAppearanceHearingId = templateValues.data.hearings &&
      getNextHearing(templateValues.data.hearings, moment(), templateValues.data.source)?.hearingId
    templateValues.data.hearings = templateValues.data.hearings?.sort((a, b) => {
      return moment(b.hearingDateTime).unix() - moment(a.hearingDateTime).unix()
    })
    templateValues.enableCaseHistory = settings.enableCaseHistory
    templateValues.enableCaseComments = settings.enableCaseComments
    templateValues.enableCaseProgress = settings.enableCaseProgress
    templateValues.currentUserUuid = res.locals.user.uuid
    const context = { court: courtCode, username: res.locals.username, sourceType: templateValues.data.source }
    templateValues.features = {
      caseComments: featuresToggles.caseComments.isEnabled(context),
      caseProgress: featuresToggles.caseProgress.isEnabled(context),
      caseProgressNextAppearanceBadge: featuresToggles.caseProgressNextAppearanceBadge.isEnabled(context)
    }
    session.confirmedMatch = undefined
    session.matchName = undefined
    session.matchType = 'defendant'
    session.matchDate = undefined
    session.backLink = path
    session.caseCommentBlankError = undefined
    res.render('case-summary', templateValues)
  }))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/showPreviousComments', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session, body: { caseId } } = req
    session.showPreviousComments = caseId
    res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#previousComments`)
  }))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/hideOlderComments', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session } = req
    session.showPreviousComments = undefined
    res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#previousComments`)
  }))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/hearings/showPreviousHearings', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session, body: { caseId } } = req
    session.showPreviousHearings = caseId
    res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseHearingsHeading`)
  }))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/hearings/hideOlderHearings', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session } = req
    session.showPreviousHearings = undefined
    res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseHearingsHeading`)
  }))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/:commentId/delete', defaults, catchErrors(deleteCaseCommentConfirmationHandler))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/:commentId/delete', defaults, catchErrors(deleteCaseCommentHandler))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments', defaults, catchErrors(addCaseCommentRequestHandler))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/notes', defaults, catchErrors(addHearingNoteRequestHandler))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/notes/delete', defaults, catchErrors(deleteHearingNoteConfirmationHandler))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/notes/delete', defaults, catchErrors(deleteHearingNoteHandler))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/record', defaults, catchErrors(getProbationRecordHandler))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/record/:convictionId?', defaults, catchErrors(async (req, res) => {
    const { params: { convictionId } } = req
    const templateValues = await getCaseAndTemplateValues(req)

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
          custodyDetails
        }
      }
    }

    templateValues.data.communityData = communityResponse || {}

    templateValues.title = getOrderTitle(communityResponse)

    res.render('case-summary-record-order', templateValues)
  }))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/record/:convictionId/breach/:breachId', defaults, catchErrors(async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)//
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
  }))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/record/:convictionId/licence-details', defaults, catchErrors(async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Licence conditions details'

    const { data: { crn } } = templateValues
    const communityResponse = await getProbationRecord(crn)

    templateValues.data.communityData = communityResponse || {}
    res.render('case-summary-record-order-licence', templateValues)
  }))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/risk', defaults, catchErrors(async (req, res) => {
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Risk register'

    const { data: { crn } } = templateValues

    templateValues.data.riskData = await getRiskDetails(crn)

    templateValues.params = {
      ...templateValues.params
    }

    res.render('case-summary-risk', templateValues)
  }))

  router.get('/:courtCode/match/bulk/:date', defaults, catchErrors(async (req, res) => {
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
    session.matchType = 'bulk'
    session.matchDate = date
    session.courtCode = courtCode
    res.render('match-records', templateValues)
  }))

  router.get('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId', defaults, catchErrors(async (req, res) => {
    const { params: { defendantId }, session, path } = req
    const templateValues = await getCaseAndTemplateValues(req)
    templateValues.title = 'Review possible NDelius records'
    const { data: { defendantName } } = templateValues
    const response = await getMatchDetails(defendantId)
    templateValues.session = {
      ...session
    }
    templateValues.data = {
      ...templateValues.data,
      matchData: response && response.offenderMatchDetails
    }
    session.confirmedMatch = undefined
    session.matchName = defendantName
    session.formError = false
    session.serverError = false
    session.backLink = path
    res.render('match-defendant', templateValues)
  }))

  router.post('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, caseId, defendantId, hearingId }, body: { crn }, session } = req
    let redirectUrl
    const tryAgainRedirect = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}`
    if (!crn) {
      session.confirmedMatch = undefined
      session.formError = true
      redirectUrl = tryAgainRedirect
    } else {
      let response
      try {
        response = await updateCaseDetails(caseId, hearingId, defendantId, crn)
      } catch (e) {
        response = e.response
      }
      if (response.status === 200) {
        session.confirmedMatch = {
          name: session.matchName,
          matchType: 'Known'
        }
        redirectUrl = `/${getMatchedUrl(session.matchType, session.matchDate, hearingId, defendantId, courtCode)}`
      } else {
        session.serverError = true
        redirectUrl = tryAgainRedirect
      }
    }
    res.redirect(302, redirectUrl)
  }))

  router.get('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/nomatch/:unlink?', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, defendantId, hearingId, unlink }, session } = req
    let redirectUrl
    const response = await unlinkOffender(defendantId)
    if (response.status === 200) {
      session.confirmedMatch = {
        name: session.matchName,
        matchType: unlink ? 'unlinked' : 'No record'
      }
      redirectUrl = `/${getMatchedUrl(session.matchType, session.matchDate, hearingId, defendantId, courtCode)}`
    } else {
      req.session.serverError = true
      redirectUrl = `/${courtCode}/hearing/${hearingId}/match/defendant/${defendantId}`
    }
    res.redirect(302, redirectUrl)
  }))

  router.get('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/manual', defaults, catchErrors(async (req, res) => {
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
  }))

  router.post('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/manual', body('crn').trim().escape(), defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, caseId, defendantId, hearingId }, body: { crn }, session } = req
    session.serverError = false
    session.formError = false
    session.formInvalid = false
    session.crnInvalid = false
    session.confirmedMatch = undefined
    session.matchName = undefined
    let redirectUrl = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/manual`
    if (!crn) {
      session.formError = true
    } else if (!req.body.crn.match(/^[A-Za-z][0-9]{6}$/)) {
      session.formError = true
      session.formInvalid = true
    } else {
      let detailResponse
      try {
        detailResponse = await getDetails(crn)
      } catch (e) {
        detailResponse = e.response
      }
      if (detailResponse.status >= 400) {
        session.crn = req.body.crn
        session.status = detailResponse.status
        session.formError = true
        session.crnInvalid = true
      } else {
        redirectUrl = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/confirm/${crn}`
      }
    }
    res.redirect(302, redirectUrl)
  }))

  router.get('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/confirm/:crn', defaults, catchErrors(async (req, res) => {
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
  }))

  router.post('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/confirm', body('crn').trim().escape(), defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, caseId, defendantId, hearingId }, body: { crn }, session } = req
    session.serverError = false
    let redirectUrl = '/'
    const response = await updateCaseDetails(caseId, hearingId, defendantId, crn)
    if (response.status === 200) {
      session.confirmedMatch = {
        name: session.matchName,
        matchType: 'linked',
        probationStatus: response.data.probationStatus
      }
      redirectUrl = `/${getMatchedUrl(session.matchType, session.matchDate, hearingId, defendantId, courtCode)}`
    } else {
      session.serverError = true
      redirectUrl = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/confirm`
    }
    res.redirect(302, redirectUrl)
  }))

  router.get('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/unlink/:crn', defaults, catchErrors(async (req, res) => {
    const { params: { courtCode, defendantId, crn, hearingId }, session } = req
    const templateValues = await getCaseAndTemplateValues(req)
    const detailResponse = await getDetails(crn)
    templateValues.title = 'Unlink NDelius record from the defendant'
    templateValues.hideSubnav = true
    templateValues.backText = 'Back'
    templateValues.backLink = `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`
    templateValues.hideUnlinkButton = true
    templateValues.params = {
      ...templateValues.params
    }
    templateValues.details = {
      ...detailResponse
    }
    session.matchName = templateValues.data.defendantName
    res.render('match-unlink', templateValues)
  }))

  async function updateCaseDetails (caseId, hearingId, defendantId, crn) {
    const offenderDetail = await getDetails(crn)
    const probationStatusDetails = await getProbationStatusDetails(crn)
    return await updateOffender(defendantId, {
      probationStatus: probationStatusDetails.status,
      crn: offenderDetail && offenderDetail.otherIds ? offenderDetail.otherIds.crn : undefined,
      previouslyKnownTerminationDate: probationStatusDetails.previouslyKnownTerminationDate,
      breach: probationStatusDetails.inBreach,
      preSentenceActivity: probationStatusDetails.preSentenceActivity,
      awaitingPsr: probationStatusDetails.awaitingPsr,
      pnc: sendPncAndCroWithOffenderUpdates && offenderDetail && offenderDetail.otherIds ? offenderDetail.otherIds.pncNumber : undefined,
      cro: sendPncAndCroWithOffenderUpdates && offenderDetail && offenderDetail.otherIds ? offenderDetail.otherIds.croNumber : undefined
    })
  }

  async function unlinkOffender (defendantId) {
    return await deleteOffender(defendantId)
  }

  function getMatchedUrl ($matchType, $matchDate, $hearingId, $defendantId, $courtCode) {
    return $matchType === 'bulk' ? $courtCode + '/match/bulk/' + $matchDate : $courtCode + '/hearing/' + $hearingId + '/defendant/' + $defendantId + '/summary'
  }

  return router
}
