/* global describe, it, expect, jest */

describe('ggetAutoSaveDraftCaseCommentHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  caseServiceMock.saveDraftCaseComment = jest.fn(() => ({ status: 200, data: 'some-data' }))
  const subject = require('../../../server/routes/handlers/getAutoSaveCaseCommentHandler')(caseServiceMock)
  const testDefendantId = 'test-defendant-id'
  const testCaseId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'
  const courtCode = 'B007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId, courtCode },
    body: { caseId: testCaseId, comment: 'A comment update' },
    path: '/test/path',
    session: {}
  }

  it('should invoke update case comment and render case summary', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.saveDraftCaseComment).toHaveBeenLastCalledWith(testCaseId, 'test-defendant-id', 'A comment update', 'Adam Sandler')
    expect(mockResponse.send).toHaveBeenCalledWith('some-data', 200)
  })
})
