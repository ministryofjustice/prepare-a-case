/* global describe, it, expect, jest, beforeEach */

jest.mock('../../server/utils/azure-appinsights', () => ({
  trackEvent: jest.fn()
}))

const telemetryClient = require('../../server/utils/azure-appinsights')
const trackEvent = require('../../server/utils/analytics')
const userContext = require('../../server/utils/userContext')

describe('custom event user UUID', () => {
  beforeEach(() => {
    telemetryClient.trackEvent.mockClear()
  })

  it('adds the authenticated UUID and preserves existing properties', () => {
    const res = { locals: { user: { uuid: 'user-uuid-1' } } }

    userContext.middleware({}, res, () => {
      trackEvent('PiCCaseCommentSuccess', { court: 'B1007', caseId: 'case-1' })
    })

    expect(telemetryClient.trackEvent).toHaveBeenCalledWith({
      name: 'PiCCaseCommentSuccess',
      properties: { court: 'B1007', caseId: 'case-1', userUuid: 'user-uuid-1' }
    })
  })

  it('does not add a UUID outside an authenticated context', () => {
    trackEvent('PiCsignInServiceError', { reason: 'test' })

    expect(telemetryClient.trackEvent).toHaveBeenCalledWith({
      name: 'PiCsignInServiceError',
      properties: { reason: 'test' }
    })
  })

  it('keeps UUIDs separate across overlapping requests', async () => {
    const emitEvent = (uuid, caseId) => new Promise(resolve => {
      const res = { locals: { user: { uuid } } }

      userContext.middleware({}, res, () => {
        setImmediate(() => {
          trackEvent('PiCCaseCommentSuccess', { caseId })
          resolve()
        })
      })
    })

    await Promise.all([
      emitEvent('user-uuid-1', 'case-1'),
      emitEvent('user-uuid-2', 'case-2')
    ])

    expect(telemetryClient.trackEvent).toHaveBeenCalledTimes(2)
    expect(telemetryClient.trackEvent).toHaveBeenCalledWith({
      name: 'PiCCaseCommentSuccess',
      properties: { caseId: 'case-1', userUuid: 'user-uuid-1' }
    })
    expect(telemetryClient.trackEvent).toHaveBeenCalledWith({
      name: 'PiCCaseCommentSuccess',
      properties: { caseId: 'case-2', userUuid: 'user-uuid-2' }
    })
  })
})
