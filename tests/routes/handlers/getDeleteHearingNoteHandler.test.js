/* global describe, it, expect, jest */

describe('getDeleteHearingNoteHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getDeleteHearingNoteHandler')(caseServiceMock)
  const defendantId = 'test-defendant-id'
  const hearingId = 'test-hearing-id'
  const targetHearingId = 'target-hearing-id'

  const noteId = 1234561
  const courtCode = 'B1007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId, hearingId, courtCode },
    body: { targetHearingId, noteId },
    query: { page: 1 },
    path: '/test/path',
    session: {}
  }

  it('should invoke delete hearing note api and redirect to case summary delete success notification', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.session.deleteHearingNoteSuccess).toEqual(targetHearingId)
    expect(caseServiceMock.deleteHearingNote).toHaveBeenCalledWith(targetHearingId, noteId)
    expect(mockResponse.redirect).toHaveBeenCalledWith(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
  })
})
