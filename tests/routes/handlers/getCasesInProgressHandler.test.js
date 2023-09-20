/* global describe, it, expect */

const getOutcomeTypesListFilters = require('../../../server/utils/getOutcomeTypesListFilters')
describe('getCasesInProgressHandler', () => {
  const {
    mockResponse,
    caseServiceMock: caseService
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/outcomes/getCasesInProgressHandler')(caseService)
  const courtCode = 'B007'

  const mockRequest = {
    params: { courtCode },
    session: {}
  }

  const filters = getOutcomeTypesListFilters()

  it('should render error page when getOutcomesList returns errors', async () => {
    // Given
    caseService.getOutcomesList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseService.getOutcomesList).toHaveBeenCalled()
    expect(caseService.getOutcomesList).toHaveBeenCalledWith(courtCode, filters, undefined, undefined)
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
    expect(caseService.getOutcomesList).toHaveBeenCalledWith(courtCode, filters, undefined, undefined)
    expect(mockResponse.render).toHaveBeenCalled()
  })
})