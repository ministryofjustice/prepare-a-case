/* global describe, it, expect, jest */

describe('getUpdateCommentRequestHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getUpdateCommentRequestHandler')(caseServiceMock)
  const testDefendantId = 'test-defendant-id'
  const testCaseId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'
  const courtCode = 'B007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId, courtCode },
    body: { caseId: testCaseId, comment: 'A comment update', commentId: 123 },
    path: '/test/path',
    session: {}
  }

  it('should invoke update case comment and render case summary', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.updateCaseComment).toHaveBeenLastCalledWith(testCaseId, 123, 'A comment update', 'Adam Sandler')
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary#caseComments`)
  })
})
