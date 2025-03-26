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
    path: '/test/path',
    session: {}
  }

  it('should invoke add case comment and render case summary', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.addCaseComment).toHaveBeenLastCalledWith(testCaseId, 'test-defendant-id', 'A comment', 'Adam Sandler')
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary#caseComments`)
  })

  it('should set error flag when comment is not provided', async () => {
    // When
    await subject({ ...mockRequest, body: { caseId: testCaseId, comment: '' } }, mockResponse)

    // Then
    expect(caseServiceMock.addCaseComment).not.toHaveBeenCalled()
    expect(mockRequest.session.caseCommentBlankError).toEqual(true)
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary#caseComments`)
  })
})
