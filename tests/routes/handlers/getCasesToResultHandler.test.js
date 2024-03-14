/* global describe, it, expect, jest */

jest.mock('.././../../server/utils/getOutcomeTypesListFilters', () => {
  return jest.fn(() => ({
    id: 'outcomeType',
    label: 'Outcome type',
    items: [
      { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
      { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
      { label: 'Report requested', value: 'REPORT_REQUESTED' }]
  }))
})

jest.mock('../../../server/services/case-service', () => ({
  ...jest.requireActual('../../../server/services/case-service'),
  getCase: jest.fn(() => ({ defendantName: 'some-name' }))
}))

describe('postCasesToResultHandler (postActionsHandler)', () => {
  const {
    mockResponse,
    caseServiceMock: caseService
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/outcomes/postActionsHandler')(caseService)
  const courtCode = 'B007'

  const query = {
    outcomeType: ['ADJOURNED']
  }
  const mockRequest = {
    params: { courtCode },
    body: { action: 'assign', defendantHearingId: '81b6e516-4e9d-4c92-a38b-68e159cfd6c4_7e0f9cb9-b492-4657-9028-a86de13' },
    query,
    session: {}
  }

  it('should call assign hearing outcome on post', async () => {
    await subject(mockRequest, mockResponse)
    console.log('🚀 ~ it ~ should call assign hearing outcome on post:')

    expect(caseService.assignHearingOutcome).toHaveBeenCalled()
    expect(caseService.assignHearingOutcome).toHaveBeenCalledWith(courtCode, '7e0f9cb9-b492-4657-9028-a86de13', '81b6e516-4e9d-4c92-a38b-68e159cfd6c4')
  })
})

describe('getCasesToResultHandler', () => {
  const {
    mockResponse,
    caseServiceMock: caseService
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/outcomes/getCasesToResultHandler')(caseService)
  const courtCode = 'B007'

  const query = {
    outcomeType: ['ADJOURNED']
  }
  const mockRequest = {
    params: { courtCode },
    query,
    session: {}
  }

  it('should render error page when getOutcomesList returns errors', async () => {
    // Given
    caseService.getOutcomesList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(caseService.getOutcomesList).toHaveBeenCalled()
    expect(caseService.getOutcomesList).toHaveBeenCalledWith(courtCode, query, undefined, undefined)
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
    expect(caseService.getOutcomesList).toHaveBeenCalledWith(courtCode, query, undefined, undefined)
    expect(mockResponse.render).toHaveBeenCalled()
  })
})
