/* global beforeEach, describe, it, expect, jest */

const getCancelMatchRouteHandler = require('../../../server/routes/handlers/getCancelMatchRouteHandler')
const trackEvent = require('../../../server/utils/analytics')

jest.mock('../../../server/utils/analytics')

describe('getCancelMatchRouteHandler', () => {
  let mockRequest, mockResponse

  beforeEach(() => {
    mockRequest = {
      params: { courtCode: 'test-court' },
      session: {
        matchType: 'bulk',
        matchDate: '2024-11-11',
        hearingId: 'test-hearing-id',
        defendantId: 'test-defendant-id'
      }
    }
    mockResponse = {
      redirect: jest.fn()
    }
  })

  it('should redirect to bulk match URL and call trackEvent for "bulk" matchType', () => {
    const expectedUrl = '/test-court/match/bulk/2024-11-11'

    getCancelMatchRouteHandler(mockRequest, mockResponse)

    expect(mockResponse.redirect).toHaveBeenCalledWith(expectedUrl)
    expect(trackEvent).toHaveBeenCalledWith('PiCMatcherCancelLinkClicked', {
      action: 'Cancel match defendant',
      courtCode: 'test-court',
      matchType: 'bulk',
      backUrl: expectedUrl
    })
  })

  it('should redirect to hearing summary URL and call trackEvent for non-bulk matchType', () => {
    mockRequest.session.matchType = 'single'
    const expectedUrl = '/test-court/hearing/test-hearing-id/defendant/test-defendant-id/summary'

    getCancelMatchRouteHandler(mockRequest, mockResponse)

    expect(mockResponse.redirect).toHaveBeenCalledWith(expectedUrl)
    expect(trackEvent).toHaveBeenCalledWith('PiCMatcherCancelLinkClicked', {
      action: 'Cancel match defendant',
      courtCode: 'test-court',
      matchType: 'single',
      backUrl: expectedUrl
    })
  })
})
