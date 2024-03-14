/* global describe, it, expect, jest */

describe('getAddNoteRequestHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getAddHearingOutcomeHandler')(caseServiceMock)
  const testDefendantId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'
  const targetHearingId = 'test-target-hearing-id'
  const targetDefendantId = 'test-defendant-id'
  const courtCode = 'B007'

  const hearingOutcomeType = 'REPORT_REQUESTED'
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId, courtCode },
    body: { targetHearingId, targetDefendantId, hearingOutcomeType },
    path: '/test/path',
    session: {}
  }

  it('should invoke add hearing outcome and redirect to case summary', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.addHearingOutcome).toHaveBeenCalledWith(targetHearingId, testDefendantId, hearingOutcomeType)
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary`)
    expect(mockRequest.session.addHearingOutcomeSuccess).toBe(true)
  })
})
