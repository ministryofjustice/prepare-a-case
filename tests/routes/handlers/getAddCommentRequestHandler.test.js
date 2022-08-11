/* global describe, it, expect, jest */

describe('getAddCommentRequestHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getAddCommentRequestHandler')(caseServiceMock)
  const testDefendantId = 'test-defendant-id'
  const testCaseId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'
  const courtCode = 'B007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId, courtCode },
    body: { caseId: testCaseId, comment: 'A comment' },
    path: '/test/path'
  }

  it('should invoke add case comment and render case summary', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.addCaseComment).toHaveBeenLastCalledWith(testCaseId, 'A comment', 'Adam Sandler', 'test-user-uuid')
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary#caseComments`)
  })
})
