/* global describe, it, expect, jest */

describe('getMoveToResultedHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('../test-helpers')
  const subject = require('../../../../server/routes/handlers/outcomes/getMoveToResultedHandler')(caseServiceMock)
  const hearingId = 'test-hearing-id'
  const defendantId = 'test-defendant-id'
  const courtCode = 'B1007'
  const defendantName = 'Joe Blogs'
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { hearingId, courtCode, defendantId },
    path: '/test/path',
    query: { defendantName },
    session: {}
  }

  it('should invoke update hearing outcome to resulted and redirect to in-progress hearing outcomes tab', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.updateHearingOutcomeToResulted).toHaveBeenCalledWith(hearingId, defendantId, expect.anything())
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/outcomes/in-progress`)
    expect(mockRequest.session.moveToResultedSuccess).toBe(defendantName)
  })
})
