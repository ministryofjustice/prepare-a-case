/* global describe, it, expect, jest */

describe('getCaseTemplateValuesHelper', () => {
  const { caseServiceMock: caseService } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getCaseTemplateValuesHelper')(caseService)
  const testDefendantId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'

  const session = {
    currentCaseListViewLink: '/test/case/link',
    backLink: '/back/link',
    caseListDate: '2022-01-01'
  }

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId },
    query: { page: 1 },
    session,
    path: '/test/path'
  }

  it('should return case and template values', async () => {
    // Given
    const testCase = { caseId: 'test-case-id' }
    caseService.getCase.mockReturnValueOnce(testCase)

    // When
    const actual = await subject(mockRequest)

    // Then
    expect(caseService.getCase).toHaveBeenLastCalledWith(testHearingId, testDefendantId)
    expect(actual).toStrictEqual({
      currentCaseListViewLink: session.currentCaseListViewLink,
      backLink: session.backLink,
      params: mockRequest.params,
      caseListDate: session.caseListDate,
      data: {
        ...testCase
      }
    })
  })

  it('should return caseListDate with today\'s date when session.caseListDate is not present', async () => {
    // Given
    const testCase = { caseId: 'test-case-id' }
    caseService.getCase.mockReturnValueOnce(testCase)

    // When
    const actual = await subject(
      {
        ...mockRequest,
        session: { ...session, caseListDate: undefined }
      }
    )

    // Then
    expect(caseService.getCase).toHaveBeenLastCalledWith(testHearingId, testDefendantId)
    expect(actual).toStrictEqual({
      currentCaseListViewLink: session.currentCaseListViewLink,
      backLink: session.backLink,
      params: mockRequest.params,
      caseListDate: new Date().toJSON().replace(/T.*/, ''),
      data: {
        ...testCase
      }
    })
  })

  it('should return error response back to caller when getCase API call fails', async () => {
    // Given
    const errorResponse = { isError: true, status: 500 }
    caseService.getCase.mockReturnValueOnce(errorResponse)

    // When
    const actual = await subject(mockRequest)

    // Then
    expect(caseService.getCase).toHaveBeenLastCalledWith(testHearingId, testDefendantId)
    expect(actual).toStrictEqual(errorResponse)
  })
})
