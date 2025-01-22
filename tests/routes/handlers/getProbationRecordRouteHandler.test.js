/* global describe, it, expect, jest */

describe('getProbationRecordRouteHandler', () => {
  const {
    communityServiceMock,
    getCaseAndTemplateValuesMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getProbationRecordRouteHandler')(communityServiceMock, getCaseAndTemplateValuesMock)
  const testDefendantId = 'test-defendant-id'
  const testHearingId = 'test-hearing-id'

  const session = {
    currentCaseListViewLink: '/test/case/link',
    backLink: '/back/link',
    caseListDate: '2022-01-01',
    showAllPreviousOrders: true
  }

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId: testDefendantId, hearingId: testHearingId },
    query: { page: 1 },
    session,
    path: '/test/path'
  }
  const testCrn = 'test-crn'
  const testCase = { caseId: 'test-case-id', crn: testCrn }
  const testCommunityResponse = { crn: testCrn }

  it('should return case and template values', async () => {
    // Given
    const testTemplateValues = {
      currentCaseListViewLink: '/test/case/link',
      backLink: '/back/link',
      params: mockRequest.params,
      caseListDate: '2022-06-03',
      data: {
        ...testCase
      }
    }
    getCaseAndTemplateValuesMock.mockReturnValueOnce(testTemplateValues)
    communityServiceMock.getProbationRecord.mockReturnValueOnce(testCommunityResponse)
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(getCaseAndTemplateValuesMock).toHaveBeenLastCalledWith(mockRequest)
    expect(communityServiceMock.getProbationRecord).toHaveBeenLastCalledWith(testCase.crn, true)
    expect(mockResponse.render).toHaveBeenCalledWith('case-summary/case-summary-record', {
      ...testTemplateValues,
      params: { ...testTemplateValues.params, showAllPreviousOrders: true },
      data: { ...testTemplateValues.data, communityData: testCommunityResponse },
      title: 'Probation record'
    })
  })

  it('should render error page when getCaseAndTemplateValues returns error', async () => {
    // Given
    const testErrorResponse = {
      isError: true,
      status: 500
    }
    getCaseAndTemplateValuesMock.mockReturnValueOnce(testErrorResponse)

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(getCaseAndTemplateValuesMock).toHaveBeenLastCalledWith(mockRequest)
    expect(communityServiceMock.getProbationRecord).not.toBeCalled()
    expect(mockResponse.render).toBeCalledWith('error', { status: testErrorResponse.status })
  })
})
