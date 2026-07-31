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

jest.mock('.././../../server/utils/nunjucksComponents', () => {
  return {
    getFilterComponent: jest.fn(),
    populateTemplateValuesWithComponent: (input) => input
  }
})

describe('getCasesToResultHandler', () => {
  const {
    mockResponse,
    caseServiceMock: caseService
  } = require('./test-helpers')
  const userPreferenceService = { getFilters: jest.fn(), setFilters: jest.fn() }
  const subject = require('../../../server/routes/handlers/outcomes/getCasesToResultHandler')(caseService, userPreferenceService)
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

  it('should render the correct heading and title', async () => {
    // Given
    caseService.getOutcomesList.mockReturnValueOnce({
      totalElements: 4,
      countsByState: { inProgressCount: 2 },
      courtRoomFilters: [],
      cases: [{}, {}, {}, {}]
    })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/casesToResult',
      expect.objectContaining({
        heading: 'Hearing outcomes',
        title: 'Hearing outcomes - Cases to result'
      })
    )
  })

  it('should sort cases by defendant name ascending when defendant sort is selected', async () => {
    // Given
    const requestWithDefendantSort = {
      ...mockRequest,
      params: {
        ...mockRequest.params,
        defendantSort: 'ascending'
      }
    }

    caseService.getOutcomesList.mockReturnValueOnce({
      totalElements: 2,
      countsByState: { inProgressCount: 0 },
      courtRoomFilters: [],
      cases: [
        { name: { forename1: 'Zoe', surname: 'Alpha' }, defendantName: '' },
        { name: { forename1: 'Adam', surname: 'Zulu' }, defendantName: '' }
      ]
    })

    // When
    await subject(requestWithDefendantSort, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/casesToResult',
      expect.objectContaining({
        data: [
          expect.objectContaining({ name: { forename1: 'Adam', surname: 'Zulu' } }),
          expect.objectContaining({ name: { forename1: 'Zoe', surname: 'Alpha' } })
        ]
      })
    )
  })

  it('should sort cases by probation status ascending when probation status sort is selected', async () => {
    // Given
    const requestWithProbationStatusSort = {
      ...mockRequest,
      params: {
        ...mockRequest.params,
        probationStatusSort: 'ascending'
      }
    }

    caseService.getOutcomesList.mockReturnValueOnce({
      totalElements: 2,
      countsByState: { inProgressCount: 0 },
      courtRoomFilters: [],
      cases: [
        { probationStatus: 'Possible NDelius record', defendantName: 'A Example' },
        { probationStatus: 'Current', defendantName: 'B Example' }
      ]
    })

    // When
    await subject(requestWithProbationStatusSort, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/casesToResult',
      expect.objectContaining({
        data: [
          expect.objectContaining({ probationStatus: 'Current' }),
          expect.objectContaining({ probationStatus: 'Possible NDelius record' })
        ]
      })
    )
  })
})
