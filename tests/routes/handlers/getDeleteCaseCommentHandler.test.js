/* global describe, it, expect, jest */

describe('getDeleteCaseCommentHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getDeleteCaseCommentHandler')(caseServiceMock)
  const defendantId = 'test-defendant-id'
  const hearingId = 'test-hearing-id'
  const caseId = 'test-case-id'

  const commentId = 1234561
  const courtCode = 'B1007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId, hearingId, commentId, courtCode },
    body: { caseId },
    query: { page: 1 },
    path: '/test/path',
    session: {}
  }

  it('should invoke delete comment api and redirect to case summary delete success notification', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.deleteCaseComment).toHaveBeenCalledWith(caseId, 'test-defendant-id', commentId)
    expect(mockResponse.redirect).toHaveBeenCalledWith(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseComments`)
  })
})
