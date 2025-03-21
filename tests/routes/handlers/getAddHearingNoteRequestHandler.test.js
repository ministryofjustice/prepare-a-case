/* global describe, it, expect, jest */

describe('getAddNoteRequestHandler', () => {
  const { caseServiceMock, mockResponse } = require('./test-helpers')
  const subject =
    require('../../../server/routes/handlers/getAddHearingNoteRequestHandler')(
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
    body: { hearingId: testHearingId, note: 'A note' },
    path: '/test/path',
    session: {}
  }

  it('should invoke add hearing note and render case summary note', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.session.addHearingNoteSuccess).toEqual(testHearingId)
    expect(caseServiceMock.addHearingNote).toHaveBeenCalledWith(
      testHearingId,
      'A note',
      'Adam Sandler',
      'test-defendant-id'
    )
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      `/${courtCode}/hearing/${testHearingId}/defendant/${testDefendantId}/summary#case-progress-hearing-${testHearingId}`
    )
  })

  it('should not show anything when a note is not provided', async () => {
    // When
    await subject(
      { ...mockRequest, body: { caseId: testHearingId, note: '' } },
      mockResponse
    )

    // Then
    expect(caseServiceMock.addHearingNote).not.toHaveBeenCalled()
  })
})
