/* global describe, it, expect, jest */

describe('getAssignUserToOutcomeRequestHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/outcomes/getAssignUserToOutcomeRequestHandler')(caseServiceMock)
  const testHearingId = 'test-hearing-id'
  const targetDefendantId = 'test-target-defendant-id'
  const targetCourtCode = 'B007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { hearingId: testHearingId },
    body: { targetCourtCode, targetDefendantId },
    path: '/test/path',
    session: {}
  }

  it('should invoke add hearing outcome and redirect to case summary', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.assignHearingOutcome).toHaveBeenCalledWith(testHearingId, 'Adam Sandler')
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${targetCourtCode}/hearing/${testHearingId}/defendant/${targetDefendantId}/summary`)
    expect(mockRequest.session.assignHearingOutcomeSuccess).toBe(true)
  })
})
