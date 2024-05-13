/* global describe, it, expect, jest */

describe('getMoveToResultedHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('../test-helpers')
  const utilsMock = {
    nunjucksFilters: {
      removeTitle: jest.fn(x => x),
      properCase: jest.fn(x => x),
      apostropheInName: jest.fn(x => x)
    }
  }
  const subject = require('../../../../server/routes/handlers/outcomes/getMoveToResultedHandler')(caseServiceMock, utilsMock)
  const hearingId = 'test-hearing-id'
  const defendantId = 'test-defendant-id'
  const courtCode = 'B1007'
  const defendantName = 'Joe Blogs'
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { hearingId, courtCode, defendantId },
    path: '/test/path',
    query: { defendantName },
    session: {},
    flash: jest.fn()
  }

  it('should invoke update hearing outcome to resulted and redirect to in-progress hearing outcomes tab', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseServiceMock.updateHearingOutcomeToResulted).toHaveBeenCalledWith(hearingId, defendantId)
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/outcomes/in-progress`)
    expect(mockRequest.flash).toHaveBeenCalledWith('moved-to-resulted', "You have moved Joe Blogs's case to resulted cases.")
  })

  it('should invoke update hearing outcome to resulted and redirect to on-hold hearing outcomes tab', async () => {
    // When
    await subject({ ...mockRequest, query: { ...mockRequest.query, redirectPage: 'on-hold' } }, mockResponse)

    // Then
    expect(caseServiceMock.updateHearingOutcomeToResulted).toHaveBeenCalledWith(hearingId, defendantId)
    expect(mockResponse.redirect).toHaveBeenCalledWith(`/${courtCode}/outcomes/on-hold`)
    expect(mockRequest.flash).toHaveBeenCalledWith('moved-to-resulted', "You have moved Joe Blogs's case to resulted cases.")
  })
})
