/* global beforeEach, describe, it, expect, jest */

const getCancelMatchRouteHandler = require('../../../server/routes/handlers/matchRecords/cancelMatchRouteHandler')
const trackEvent = require('../../../server/utils/analytics')
const { settings } = require('../../../server/config')

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
    jest.replaceProperty(settings, 'enableMatcherLogging', true)

    getCancelMatchRouteHandler(mockRequest, mockResponse)

    expect(mockResponse.redirect).toHaveBeenCalledWith(expectedUrl)
    expect(trackEvent).toHaveBeenCalledWith('PiCMatcherCancelLinkClicked',
      'test-court',
      'bulk',
      '2024-11-11',
      'test-hearing-id',
      'test-defendant-id'
    )
  })

  it('should redirect to hearing summary URL and call trackEvent for non-bulk matchType', () => {
    mockRequest.session.matchType = 'single'
    const expectedUrl = '/test-court/hearing/test-hearing-id/defendant/test-defendant-id/summary'
    jest.replaceProperty(settings, 'enableMatcherLogging', true)

    getCancelMatchRouteHandler(mockRequest, mockResponse)

    expect(mockResponse.redirect).toHaveBeenCalledWith(expectedUrl)
    expect(trackEvent).toHaveBeenCalledWith('PiCMatcherCancelLinkClicked',
      'test-court',
      'single',
      '2024-11-11',
      'test-hearing-id',
      'test-defendant-id'
    )
  })
})
