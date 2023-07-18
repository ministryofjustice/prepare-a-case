/* global describe, it, expect */

describe('getCaseOutcomesRouteHandler', () => {
  const {
    mockResponse,
    caseServiceMock: caseService
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getCaseOutcomesRouteHandler')(caseService)
  const courtCode = 'B007'

  const mockRequest = {
    params: { courtCode },
    session: {}
  }

  it('should render error page when getOutcomesList returns errors', async () => {
    // Given
    caseService.getOutcomesList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseService.getOutcomesList).toHaveBeenCalled()
    expect(caseService.getOutcomesList).toHaveBeenCalledWith(courtCode, undefined, undefined)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('error', { status: 500 })
  })

  it('should invoke the route handler and render blank outcomes page', async () => {
    // Given
    const items = [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }]
    caseService.getOutcomesList.mockReturnValueOnce({
      totalCount: 4,
      inProgressCount: 2,
      resultedCount: 2,
      filters: [{ id: 'outcomeType', label: 'Outcome type', items }],
      sorts: [{ label: 'Hearing date', value: 'hearingDate' }],
      cases: [{}, {}, {}, {}]
    })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseService.getOutcomesList).toHaveBeenCalled()
    expect(caseService.getOutcomesList).toHaveBeenCalledWith(courtCode, undefined, undefined)
    expect(mockResponse.render).toHaveBeenCalled()
  })
})
