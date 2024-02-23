/* global describe, it, expect, jest */

describe('getAutoSaveHearingNoteEditsHandler', () => {
  const { caseServiceMock, mockResponse } = require('./test-helpers')
  const subject =
    require('../../../server/routes/handlers/getAutoSaveHearingNoteEditsHandler')(
      caseServiceMock
    )
  const testDefendantId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'
  const courtCode = 'B007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: {
      defendantId: testDefendantId,
      hearingId: testHearingId,
      courtCode
    },
    body: { hearingId: testHearingId, note: 'A note', noteId: 123 },
    path: '/test/path',
    session: {}
  }

  it('should invoke save draft note and return response', async () => {
    caseServiceMock.updateHearingNote.mockResolvedValueOnce({
      data: { note: 'note' },
      status: 200
    })
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.updateHearingNote).toHaveBeenLastCalledWith(
      testHearingId,
      'A note',
      123,
      'Adam Sandler',
      'test-defendant-id'
    )
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      `/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary#case-progress-hearing-${testHearingId}`
    )
  })
})
