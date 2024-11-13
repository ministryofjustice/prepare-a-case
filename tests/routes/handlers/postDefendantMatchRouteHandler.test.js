/* global beforeEach, describe, it, expect, jest */

const postDefendantMatchRouteHandler = require('../../../server/routes/handlers/matchRecords/defendantMatchRouteHandler')
const { getMatchedUrl } = require('../../../server/routes/helpers')
const { settings } = require('../../../server/config')
const trackEvent = require('../../../server/utils/analytics')

jest.mock('../../../server/routes/helpers')
jest.mock('../../../server/utils/analytics') // Mock trackEvent

describe('postDefendantMatchRouteHandler', () => {
  let mockRequest, mockResponse, updateCaseDetailsMock

  beforeEach(() => {
    updateCaseDetailsMock = jest.fn()
    jest.replaceProperty(settings, 'enablePastCasesNavigation', true)
    jest.replaceProperty(settings, 'enableMatcherLogging', true)

    mockRequest = {
      params: {
        courtCode: 'test-court',
        caseId: 'test-case-id',
        hearingId: 'test-hearing-id',
        defendantId: 'test-defendant-id'
      },
      body: { crn: 'CRN123', matchProbability: [0.6] },
      session: {
        matchType: 'bulk',
        matchDate: '2024-11-11',
        matchName: 'John Doe'
      }
    }
    mockResponse = {
      redirect: jest.fn()
    }
    getMatchedUrl.mockReturnValue('test-url')
    trackEvent.mockClear()
  })

  it('should set session.confirmedMatch and redirect to matched URL if updateCaseDetails is successful', async () => {
    updateCaseDetailsMock.mockResolvedValue({ status: 200 })

    await postDefendantMatchRouteHandler(updateCaseDetailsMock)(mockRequest, mockResponse)

    expect(mockRequest.session.confirmedMatch).toEqual({
      name: 'John Doe',
      matchType: 'Known',
      matchProbability: [0.6]
    })
    expect(mockResponse.redirect).toHaveBeenCalledWith(302, '/test-url')
    expect(getMatchedUrl).toHaveBeenCalledWith('bulk', '2024-11-11', 'test-hearing-id', 'test-defendant-id', 'test-court')
    expect(trackEvent).toHaveBeenCalledWith('PiCMatcherLogging', { status: 200 })
    expect(trackEvent).toHaveBeenCalledWith('PiCMatcherMoreRelevantMatchSelected', 'test-case-id', 'test-hearing-id', 'test-defendant-id', 'CRN123')
  })

  it('should not call trackEvent if enableMatcherLogging is false', async () => {
    jest.replaceProperty(settings, 'enableMatcherLogging', false)
    updateCaseDetailsMock.mockResolvedValue({ status: 200 })

    await postDefendantMatchRouteHandler(updateCaseDetailsMock)(mockRequest, mockResponse)

    expect(trackEvent).not.toHaveBeenCalled()
  })
})
