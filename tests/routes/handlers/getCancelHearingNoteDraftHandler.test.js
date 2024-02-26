/* global describe, it, expect, jest */

describe('getCancelHearingNoteDraftHandler', () => {
  const { caseServiceMock, mockResponse } = require('./test-helpers')
  const subject =
    require('../../../server/routes/handlers/getCancelHearingNoteDraftHandler')(
      caseServiceMock
    )
  const defendantId = 'test-defendant-id'
  const hearingId = 'test-hearing-id'
  const targetHearingId = 'target-hearing-id'

  const courtCode = 'B1007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId, hearingId, courtCode, targetHearingId },
    query: { page: 1 },
    path: '/test/path',
    session: {}
  }

  it('should invoke delete hearing note draft api and redirect to case summary', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.deleteHearingNoteDraft).toHaveBeenCalledWith(
      targetHearingId,
      'test-defendant-id'
    )
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`
    )
  })
})
