/* global describe, it, expect, jest */

describe('getCancelCaseCommentDraftHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getCancelCaseCommentDraftHandler')(caseServiceMock)
  const testDefendantId = 'test-defendant-id'
  const testCaseId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'
  const courtCode = 'B007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId, courtCode, caseId: testCaseId },
    path: '/test/path',
    session: {}
  }

  it('should invoke cancel case comment draft', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.deleteCaseCommentDraft).toHaveBeenLastCalledWith(testCaseId)
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary#caseComments`)
  })
})
