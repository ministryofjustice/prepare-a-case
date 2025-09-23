/* global jest, describe, it, expect, beforeEach */

const caseService = require('../../../server/services/case-service')
const trackEvent = require('../../../server/utils/analytics')

// Mock the dependencies
jest.mock('../../../server/services/case-service')
jest.mock('../../../server/utils/analytics')

describe('markHearingOutcomeNotRequiredHandler', () => {
  let req, res

  beforeEach(() => {
    jest.clearAllMocks()

    req = {
      params: {
        courtCode: 'TEST',
        hearingId: 'hearing-123',
        defendantId: 'defendant-456'
      },
      session: {
        currentCaseListViewLink: '/TEST/cases/2024-01-15'
      }
    }

    res = {
      redirect: jest.fn(),
      locals: {
        user: {
          name: 'Test User',
          username: 'test.user'
        }
      }
    }
  })

  describe('successful toggle', () => {
    it('should call toggleHearingOutcomeRequired with correct parameters', async () => {
      caseService.toggleHearingOutcomeRequired.mockResolvedValue({ success: true })

      await caseService.toggleHearingOutcomeRequired(
        req.params.hearingId,
        req.params.defendantId,
        true
      )

      expect(caseService.toggleHearingOutcomeRequired).toHaveBeenCalledWith(
        'hearing-123',
        'defendant-456',
        true
      )
    })

    it('should track success event', async () => {
      caseService.toggleHearingOutcomeRequired.mockResolvedValue({ success: true })

      await caseService.toggleHearingOutcomeRequired(
        req.params.hearingId,
        req.params.defendantId,
        true
      )

      trackEvent('PiCHearingOutcomeNotRequiredSuccess', {
        hearingId: req.params.hearingId,
        defendantId: req.params.defendantId,
        user: res.locals.user
      })

      expect(trackEvent).toHaveBeenCalledWith(
        'PiCHearingOutcomeNotRequiredSuccess',
        {
          hearingId: 'hearing-123',
          defendantId: 'defendant-456',
          user: res.locals.user
        }
      )
    })

    it('should redirect to currentCaseListViewLink on success', async () => {
      caseService.toggleHearingOutcomeRequired.mockResolvedValue({ success: true })
      req.session.currentCaseListViewLink = '/TEST/cases/2024-01-15'

      const redirectUrl = req.session.currentCaseListViewLink || `/${req.params.courtCode}/cases`
      res.redirect(302, redirectUrl)

      expect(res.redirect).toHaveBeenCalledWith(302, '/TEST/cases/2024-01-15')
    })

    it('should redirect to default cases page if no currentCaseListViewLink', async () => {
      caseService.toggleHearingOutcomeRequired.mockResolvedValue({ success: true })
      delete req.session.currentCaseListViewLink

      const redirectUrl = req.session.currentCaseListViewLink || `/${req.params.courtCode}/cases`
      res.redirect(302, redirectUrl)

      expect(res.redirect).toHaveBeenCalledWith(302, '/TEST/cases')
    })
  })

  describe('service error handling', () => {
    it('should track error event when service returns error', async () => {
      const errorResponse = {
        isError: true,
        error: 'Service unavailable',
        message: 'Could not connect to backend'
      }
      caseService.toggleHearingOutcomeRequired.mockResolvedValue(errorResponse)

      const response = await caseService.toggleHearingOutcomeRequired(
        req.params.hearingId,
        req.params.defendantId,
        true
      )

      if (response && response.isError) {
        trackEvent('PiCHearingOutcomeNotRequiredError', {
          hearingId: req.params.hearingId,
          defendantId: req.params.defendantId,
          error: response.error || response.message,
          user: res.locals.user
        })
      }

      expect(trackEvent).toHaveBeenCalledWith(
        'PiCHearingOutcomeNotRequiredError',
        {
          hearingId: 'hearing-123',
          defendantId: 'defendant-456',
          error: 'Service unavailable',
          user: res.locals.user
        }
      )
    })

    it('should redirect with error parameter when service returns error', async () => {
      const errorResponse = {
        isError: true,
        error: 'Service error'
      }
      caseService.toggleHearingOutcomeRequired.mockResolvedValue(errorResponse)

      const response = await caseService.toggleHearingOutcomeRequired(
        req.params.hearingId,
        req.params.defendantId,
        true
      )

      if (response && response.isError) {
        const errorRedirectUrl = req.session.currentCaseListViewLink || `/${req.params.courtCode}/cases`
        res.redirect(302, `${errorRedirectUrl}?error=true`)
      }

      expect(res.redirect).toHaveBeenCalledWith(302, '/TEST/cases/2024-01-15?error=true')
    })
  })

  describe('exception handling', () => {
    it('should track exception event when service throws', async () => {
      const error = new Error('Network error')
      caseService.toggleHearingOutcomeRequired.mockRejectedValue(error)

      try {
        await caseService.toggleHearingOutcomeRequired(
          req.params.hearingId,
          req.params.defendantId,
          true
        )
      } catch (err) {
        trackEvent('PiCHearingOutcomeNotRequiredException', {
          hearingId: req.params.hearingId,
          defendantId: req.params.defendantId,
          error: err.message,
          user: res.locals.user
        })
      }

      expect(trackEvent).toHaveBeenCalledWith(
        'PiCHearingOutcomeNotRequiredException',
        {
          hearingId: 'hearing-123',
          defendantId: 'defendant-456',
          error: 'Network error',
          user: res.locals.user
        }
      )
    })

    it('should redirect with error parameter when exception is thrown', async () => {
      const error = new Error('Unexpected error')
      caseService.toggleHearingOutcomeRequired.mockRejectedValue(error)

      try {
        await caseService.toggleHearingOutcomeRequired(
          req.params.hearingId,
          req.params.defendantId,
          true
        )
      } catch (err) {
        const errorRedirectUrl = req.session.currentCaseListViewLink || `/${req.params.courtCode}/cases`
        res.redirect(302, `${errorRedirectUrl}?error=true`)
      }

      expect(res.redirect).toHaveBeenCalledWith(302, '/TEST/cases/2024-01-15?error=true')
    })
  })

  describe('session management', () => {
    it('should set serverError to true on service error', async () => {
      const errorResponse = { isError: true }
      caseService.toggleHearingOutcomeRequired.mockResolvedValue(errorResponse)

      const response = await caseService.toggleHearingOutcomeRequired(
        req.params.hearingId,
        req.params.defendantId,
        true
      )

      if (response && response.isError) {
        req.session.serverError = true
        req.session.errorMessage = 'Unable to update hearing outcome status. Please try again.'
      }

      expect(req.session.serverError).toBe(true)
      expect(req.session.errorMessage).toBe('Unable to update hearing outcome status. Please try again.')
    })

    it('should clear error state on success', async () => {
      caseService.toggleHearingOutcomeRequired.mockResolvedValue({ success: true })
      req.session.serverError = true
      req.session.errorMessage = 'Previous error'

      const response = await caseService.toggleHearingOutcomeRequired(
        req.params.hearingId,
        req.params.defendantId,
        true
      )

      if (!response || !response.isError) {
        req.session.serverError = false
        req.session.errorMessage = null
        req.session.notification = 'Hearing outcome marked as not required'
      }

      expect(req.session.serverError).toBe(false)
      expect(req.session.errorMessage).toBeNull()
      expect(req.session.notification).toBe('Hearing outcome marked as not required')
    })
  })
})
