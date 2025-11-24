const express = require('express')
const { body } = require('express-validator')
const getBaseDateString = require('../utils/getBaseDateString')
const queryParamBuilder = require('../utils/queryParamBuilder')
const { getMatchedUrl } = require('./helpers')

const {
  settings,
  session: { cookieOptions },
  features: { sendPncAndCroWithOffenderUpdates }
} = require('../config')
const {
  getCaseList,
  deleteOffender,
  updateOffender,
  getCaseHistory,
  files: caseFiles,
  workflow
} = require('../services/case-service')
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
const { getOrderTitle } = require('./helpers')

const { health } = require('./middleware/healthcheck')
const { defaults } = require('./middleware/defaults')
const {
  getCaseAndTemplateValues,
  getProbationRecordHandler,
  getMatchingRecordHandler,
  getCancelMatchRouteHandler,
  postDefendantMatchRouteHandler,
  outcomesRouter,
  addCaseCommentRequestHandler,
  deleteCaseCommentConfirmationHandler,
  deleteCaseCommentHandler,
  addHearingNoteRequestHandler,
  autoSaveHearingNoteHandler,
  autoSaveHearingNoteEditHandler,
  caseSearchHandler,
  cancelHearingNoteDraftHandler,
  addHearingOutcomeHandler,
  editHearingOutcomeHandler,
  autoSaveCaseCommentHandler,
  cancelCaseCommentDraftHandler,
  updateCaseCommentHandler,
  pagedCaseListRouteHandler,
  caseSummaryHandler,
  setNotificationHandler,
  setNotificationPostHandler,
  setNotificationPreviewHandler
} = require('../routes/handlers')
const catchErrors = require('./handlers/catchAsyncErrors')
const moment = require('moment')
const {
  deleteHearingNoteConfirmationHandler,
  deleteHearingNoteHandler
} = require('./handlers')
const getToggleHearingOutcomeRequiredHandler = require('./handlers/getToggleHearingOutcomeRequiredHandler')

const { registerManageCourtsRoutes, manageCourtsRoute } = require('./manage-courts/routes')
const caseService = require('../services/case-service')
const trackEvent = require('../utils/analytics')

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

  registerManageCourtsRoutes(router)

  router.get('/', (req, res) => {
    const { cookies } = req
    // @FIXME: Cookie check and removal to be removed at a later date
    if (cookies && cookies.court) {
      res.clearCookie('court')
    }
    res.redirect(
      302,
      cookies && cookies.currentCourt
        ? `/${cookies.currentCourt}/cases`
        : `${manageCourtsRoute}`
    )
  })

  // Notifications

  router.get('/set-notification', catchErrors(setNotificationHandler))

  router.get('/set-notification-preview', catchErrors(setNotificationPreviewHandler))

  router.post('/set-notification', body('notification').trim(), catchErrors(setNotificationPostHandler))

  router.get('/user-guide', (req, res) => {
    res.render('user-guide')
  })

  router.get('/accessibility-statement', (req, res) => {
    const { session } = req
    res.render('accessibility-statement', {
      params: { backLink: session.backLink }
    })
  })

  router.get('/privacy-notice', (req, res) => {
    const { session } = req
    res.render('privacy-notice', { params: { backLink: session.backLink } })
  })

  router.get('/whats-new', (req, res) => {
    res.render('whats-new')
  })

  router.get('/cookies-policy', (req, res) => {
    res.render('cookies-policy', {
      params: {
        saved: req.query.saved,
        preference: req.cookies && req.cookies.analyticsCookies
      }
    })
  })

  const cookiePreferenceHandler = (req, res) => {
    const redirectUrl = req.params.page ? '/cookies-policy?saved=true' : '/'
    if (req.body.cookies) {
      if (req.body.cookies === 'reject') {
        for (const [key] of Object.entries(req.cookies)) {
          if (/^_g/.test(key)) {
            res.clearCookie(key)
          }
        }
      }
      res
        .cookie('analyticsCookies', req.body.cookies)
        .redirect(302, redirectUrl)
    }
  }

  router.post('/cookie-preference', cookiePreferenceHandler)
  router.post('/cookie-preference/:page', cookiePreferenceHandler)

  router.get('/case-search', defaults, catchErrors(caseSearchHandler))

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary', defaults, catchErrors(caseSummaryHandler))

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary', defaults, catchErrors(caseSummaryHandler))

  router.get(
    '/select-court/:courtCode',
    catchErrors((req, res) => {
      const {
        params: { courtCode }
      } = req

      res
        .status(201)
        .cookie('currentCourt', courtCode, cookieOptions)
        .redirect(302, `/${courtCode}/cases`)
    })
  )

  // More specific routes first
  router.get(
    '/:courtCode/cases/:caseId/history',
    defaults,
    catchErrors(async (req, res) => {
      const data = await getCaseHistory(req.params.caseId)
      res.render('case-history', {
        caseId: data.caseId,
        params: req.params,
        data: JSON.stringify(data, null, 2)
      })
    })
  )

  const pagedCaseListGetHandler = catchErrors((req, res) => {
    return pagedCaseListRouteHandler(req, res)
  })

  const pagedCaseListPostHandler = catchErrors(async (req, res) => {
    const {
      params: { courtCode, date, subsection },
      session,
      body
    } = req

    const currentDate = date || getBaseDateString()

    session.courtCode = courtCode

    const redirectUrl = `/${courtCode}/cases/${currentDate}${subsection ? '/' + subsection : ''
      }`
    const queryParams = queryParamBuilder(body)

    res.redirect(
      302,
      `${redirectUrl}?${queryParams}`
    )
  })

  router.get('/:courtCode/cases', defaults, pagedCaseListGetHandler)
  router.get('/:courtCode/cases/:date', defaults, pagedCaseListGetHandler)
  router.get('/:courtCode/cases/:date/:subsection', defaults, pagedCaseListGetHandler)

  router.post('/:courtCode/cases', defaults, pagedCaseListPostHandler)
  router.post('/:courtCode/cases/:date', defaults, pagedCaseListPostHandler)
  router.post('/:courtCode/cases/:date/:subsection', defaults, pagedCaseListPostHandler)

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/record',
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, hearingId, defendantId },
        session
      } = req
      session.showAllPreviousOrders = hearingId
      res.redirect(
        302,
        `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/record#previousOrders`
      )
    })
  )

  router.put(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/auto-save-new-note',
    defaults,
    catchErrors(autoSaveHearingNoteHandler)
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/publish-edited-note',
    defaults,
    catchErrors(autoSaveHearingNoteEditHandler)
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/files/:fileId/delete',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { hearingId, defendantId, fileId }
      } = req
      const { data } = await caseFiles.delete(hearingId, defendantId, fileId)
      res.json(data)
    })
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/files/:fileId/raw',
    (req, res, next) => {
      const {
        params: { hearingId, defendantId, fileId }
      } = req
      caseFiles.getRaw(
        req,
        res,
        next,
        proxyRes => {
          if (proxyRes.statusCode >= 400) {
            throw new Error(
              `${proxyRes.statusCode} - unable to download file.`
            )
          }
        },
        hearingId,
        defendantId,
        fileId
      )
    }
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/files',
    (req, res, next) => {
      const {
        params: { hearingId, defendantId }
      } = req
      const formatter = data => {
        // date formatter
        data.datetime = moment(data.datetime).format('D MMMM YYYY')
        return data
      }
      caseFiles.post(req, res, next, formatter, hearingId, defendantId)
    }
  )

  router.post('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary', defaults, caseSummaryHandler)

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/summary', defaults, caseSummaryHandler)

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/showPreviousComments',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, hearingId, defendantId },
        session,
        body: { caseId }
      } = req
      session.showPreviousComments = caseId
      res.redirect(
        302,
        `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#previousComments`
      )
    })
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/hideOlderComments',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, hearingId, defendantId },
        session
      } = req
      session.showPreviousComments = undefined
      res.redirect(
        302,
        `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#previousComments`
      )
    })
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/hearings/showPreviousHearings',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, hearingId, defendantId },
        session,
        body: { caseId }
      } = req
      session.showPreviousHearings = caseId
      res.redirect(
        302,
        `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseHearingsHeading`
      )
    })
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/hearings/hideOlderHearings',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, hearingId, defendantId },
        session
      } = req
      session.showPreviousHearings = undefined
      res.redirect(
        302,
        `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseHearingsHeading`
      )
    })
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/:commentId/delete',
    defaults,
    catchErrors(deleteCaseCommentConfirmationHandler)
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/:commentId/delete',
    defaults,
    catchErrors(deleteCaseCommentHandler)
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments',
    defaults,
    catchErrors(addCaseCommentRequestHandler)
  )

  router.put(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/auto-save-new-comment',
    defaults,
    catchErrors(autoSaveCaseCommentHandler)
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/:caseId/cancel-draft-comment',
    defaults,
    catchErrors(cancelCaseCommentDraftHandler)
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/comments/publish-edited-comment',
    defaults,
    catchErrors(updateCaseCommentHandler)
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/notes',
    defaults,
    catchErrors(addHearingNoteRequestHandler)
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/add-hearing-outcome',
    defaults,
    catchErrors(addHearingOutcomeHandler)
  )
  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/edit-hearing-outcome',
    defaults,
    catchErrors(editHearingOutcomeHandler)
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/toggle-hearing-outcome-required',
    defaults,
    catchErrors(getToggleHearingOutcomeRequiredHandler(caseService))
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/toggle-hearing-outcome-required',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, hearingId, defendantId },
        body: { outcomeNotRequired },
        session
      } = req

      const outcomeNotRequiredBool = outcomeNotRequired === 'true' || outcomeNotRequired === true || outcomeNotRequired === undefined

      try {
        const response = await caseService.toggleHearingOutcomeRequired(hearingId, defendantId, outcomeNotRequiredBool)

        if (response && response.isError) {
          const action = outcomeNotRequiredBool ? 'not required' : 'required'
          console.error(`Error toggling hearing outcome to ${action}:`, response.error || response.message)
          trackEvent('PiCHearingOutcomeToggleError', {
            hearingId,
            defendantId,
            outcomeNotRequired: outcomeNotRequiredBool,
            error: response.error || response.message,
            user: res.locals.user
          })

          const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
          return res.redirect(302, `${errorRedirectUrl}?error=true`)
        }

        trackEvent('PiCHearingOutcomeToggleSuccess', {
          hearingId,
          defendantId,
          outcomeNotRequired: outcomeNotRequiredBool,
          user: res.locals.user
        })

        const redirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
        res.redirect(302, redirectUrl)
      } catch (error) {
        const action = outcomeNotRequiredBool ? 'not required' : 'required'
        console.error(`Exception when toggling hearing outcome to ${action}:`, error)
        trackEvent('PiCHearingOutcomeToggleException', {
          hearingId,
          defendantId,
          outcomeNotRequired: outcomeNotRequiredBool,
          error: error.message,
          user: res.locals.user
        })

        const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
        res.redirect(302, `${errorRedirectUrl}?error=true`)
      }
    })
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/notes/delete',
    defaults,
    catchErrors(deleteHearingNoteConfirmationHandler)
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/notes/:targetHearingId/cancel-draft-note',
    defaults,
    catchErrors(cancelHearingNoteDraftHandler)
  )

  router.post(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/summary/notes/delete',
    defaults,
    catchErrors(deleteHearingNoteHandler)
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/record',
    defaults,
    catchErrors(getProbationRecordHandler)
  )

  const convictionHandler = catchErrors(async (req, res) => {
    const {
      params: { convictionId }
    } = req
    const templateValues = await getCaseAndTemplateValues(req)

    const {
      data: { crn }
    } = templateValues
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

    res.render('case-summary/case-summary-record-order', templateValues)
  })

  router.get('/:courtCode/hearing/:hearingId/defendant/:defendantId/record/:convictionId', defaults, convictionHandler)

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/record/:convictionId/breach/:breachId',
    defaults,
    catchErrors(async (req, res) => {
      const templateValues = await getCaseAndTemplateValues(req) //
      templateValues.title = 'Breach details'

      const {
        params: { convictionId, breachId }
      } = req
      const {
        data: { crn }
      } = templateValues
      const communityResponse = await getProbationRecord(crn)

      const breachData = communityResponse.convictions
        .find(
          conviction =>
            conviction.convictionId.toString() === convictionId.toString()
        )
        .breaches.find(
          breach => breach.breachId.toString() === breachId.toString()
        )

      const breachDetails = await getBreachDetails(crn, convictionId, breachId)
      templateValues.data.communityData = {
        ...breachData,
        ...breachDetails
      }
      res.render('case-summary/case-summary-record-order-breach', templateValues)
    })
  )

  if (settings.enableWorkflow) {
    router.post('/workflow/tasks/:taskId/state', defaults, catchErrors(async (req, res) => {
      const {
        params: { taskId },
        query: { hearing: hearingId, defendant: defendantId },
        body: { state }
      } = req

      await workflow.tasks.state.set(taskId, state, { hearingId, defendantId })
      res.json({})
    }))
  }

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/record/:convictionId/licence-details',
    defaults,
    catchErrors(async (req, res) => {
      const templateValues = await getCaseAndTemplateValues(req)
      templateValues.title = 'Licence conditions details'

      const {
        data: { crn }
      } = templateValues
      const communityResponse = await getProbationRecord(crn)

      templateValues.data.communityData = communityResponse || {}
      res.render('case-summary/case-summary-record-order-licence', templateValues)
    })
  )

  router.get(
    '/:courtCode/hearing/:hearingId/defendant/:defendantId/risk',
    defaults,
    catchErrors(async (req, res) => {
      const templateValues = await getCaseAndTemplateValues(req)
      templateValues.title = 'Risk register'

      const {
        data: { crn }
      } = templateValues

      templateValues.data.riskData = await getRiskDetails(crn)

      templateValues.params = {
        ...templateValues.params
      }

      res.render('case-summary/case-summary-risk', templateValues)
    })
  )

  router.get(
    '/:courtCode/match/bulk/:date',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, date },
        session,
        params
      } = req
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
    })
  )

  router.get(
    '/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId',
    defaults,
    catchErrors(getMatchingRecordHandler)
  )

  router.get('/:courtCode/match/cancel', defaults, catchErrors(getCancelMatchRouteHandler))

  router.post(
    '/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId',
    defaults,
    catchErrors(postDefendantMatchRouteHandler(updateCaseDetails))
  )

  const nomatchHandler = catchErrors(async (req, res) => {
    const {
      params: { courtCode, defendantId, hearingId, unlink },
      session
    } = req
    let redirectUrl
    const response = await unlinkOffender(defendantId)
    if (response.status === 200) {
      session.confirmedMatch = {
        name: session.matchName,
        matchType: unlink ? 'unlinked' : 'No record'
      }
      redirectUrl = `/${getMatchedUrl(
        session.matchType,
        session.matchDate,
        hearingId,
        defendantId,
        courtCode
      )}`
    } else {
      req.session.serverError = true
      redirectUrl = `/${courtCode}/hearing/${hearingId}/match/defendant/${defendantId}`
    }
    res.redirect(302, redirectUrl)
  })

  router.get('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/nomatch', defaults, nomatchHandler)
  router.get('/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/nomatch/:unlink', defaults, nomatchHandler)

  router.get(
    '/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/manual',
    defaults,
    catchErrors(async (req, res) => {
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
  )

  router.post(
    '/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/manual',
    body('crn').trim().escape(),
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, caseId, defendantId, hearingId },
        body: { crn },
        session
      } = req
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
    })
  )

  router.get(
    '/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/confirm/:crn',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { crn },
        session
      } = req
      const templateValues = await getCaseAndTemplateValues(req)
      const detailResponse = await getDetails(crn)
      const probationStatusDetails = await getProbationStatusDetails(crn)
      templateValues.title = 'Link an NDelius record to the defendant'
      templateValues.details = {
        ...detailResponse,
        probationStatus:
          probationStatusDetails.status &&
          probationStatusDetails.status.replace('_', ' ')
      }
      templateValues.session = {
        ...session
      }
      session.matchName = templateValues.data.defendantName
      res.render('match-manual', templateValues)
    })
  )

  router.post(
    '/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/confirm',
    body('crn').trim().escape(),
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, caseId, defendantId, hearingId },
        body: { crn },
        session
      } = req
      session.serverError = false
      let redirectUrl
      const response = await updateCaseDetails(
        caseId,
        hearingId,
        defendantId,
        crn
      )
      if (response.status === 200) {
        session.confirmedMatch = {
          name: session.matchName,
          matchType: 'linked',
          probationStatus: response.data.probationStatus
        }
        redirectUrl = `/${getMatchedUrl(
          session.matchType,
          session.matchDate,
          hearingId,
          defendantId,
          courtCode
        )}`
      } else {
        session.serverError = true
        redirectUrl = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/confirm`
      }
      res.redirect(302, redirectUrl)
    })
  )

  router.get(
    '/:courtCode/case/:caseId/hearing/:hearingId/match/defendant/:defendantId/unlink/:crn',
    defaults,
    catchErrors(async (req, res) => {
      const {
        params: { courtCode, defendantId, crn, hearingId },
        session
      } = req
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
    })
  )

  router.use('/:courtCode/outcomes', outcomesRouter)

  async function updateCaseDetails (caseId, hearingId, defendantId, crn) {
    const offenderDetail = await getDetails(crn)
    const probationStatusDetails = await getProbationStatusDetails(crn)
    return await updateOffender(defendantId, {
      probationStatus: probationStatusDetails.status,
      crn:
        offenderDetail && offenderDetail.otherIds
          ? offenderDetail.otherIds.crn
          : undefined,
      previouslyKnownTerminationDate:
        probationStatusDetails.previouslyKnownTerminationDate,
      breach: probationStatusDetails.inBreach,
      preSentenceActivity: probationStatusDetails.preSentenceActivity,
      awaitingPsr: probationStatusDetails.awaitingPsr,
      pnc:
        sendPncAndCroWithOffenderUpdates &&
          offenderDetail &&
          offenderDetail.otherIds
          ? offenderDetail.otherIds.pncNumber
          : undefined,
      cro:
        sendPncAndCroWithOffenderUpdates &&
          offenderDetail &&
          offenderDetail.otherIds
          ? offenderDetail.otherIds.croNumber
          : undefined
    })
  }

  async function unlinkOffender (defendantId) {
    return await deleteOffender(defendantId)
  }

  return router
}
