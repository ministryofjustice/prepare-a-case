/* global describe, it, expect, jest */

describe('getAutoSaveHearingNoteHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getAutoSaveHearingNoteHandler')(caseServiceMock)
  const testDefendantId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'
  const courtCode = 'B007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId, courtCode },
    body: { hearingId: testHearingId, note: 'A note' },
    path: '/test/path',
    session: {}
  }

  it('should invoke save draft note and return response', async () => {
    caseServiceMock.saveDraftHearingNote.mockResolvedValueOnce({ data: { note: 'note' }, status: 200 })
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.saveDraftHearingNote).toHaveBeenLastCalledWith(testHearingId, 'A note', 'Adam Sandler')
    expect(mockResponse.send).toHaveBeenCalledWith({ note: 'note' }, 200)
  })
})
