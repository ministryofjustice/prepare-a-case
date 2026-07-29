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

jest.mock('.././../../server/utils/nunjucksComponents.js', () => {
  return {
    getFilterComponent: jest.fn(),
    populateTemplateValuesWithComponent: (input) => input
  }
})

describe('getCasesInProgressHandler', () => {
  const {
    mockResponse,
    caseServiceMock: caseService
  } = require('./test-helpers')
  const userPreferenceService = { getFilters: jest.fn(), setFilters: jest.fn() }
  const subject = require('../../../server/routes/handlers/outcomes/getCasesInProgressHandler')(caseService, userPreferenceService)
  const courtCode = 'B007'

  const query = {
    outcomeType: ['ADJOURNED']
  }
  const mockRequest = {
    params: { courtCode },
    session: {},
    flash: () => { },
    query
  }

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
      countsByState: { toResultCount: 2 },
      courtRoomFilters: [],
      cases: [{}, {}, {}, {}]
    })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/casesInProgress',
      expect.objectContaining({
        heading: 'Hearing outcomes',
        title: 'Hearing outcomes - In progress'
      })
    )
  })

  it('should sort in progress cases by defendant name ascending when defendant sort is selected', async () => {
    const requestWithDefendantSort = {
      ...mockRequest,
      params: {
        ...mockRequest.params,
        defendantSort: 'ascending'
      }
    }

    caseService.getOutcomesList.mockReturnValueOnce({
      totalElements: 2,
      countsByState: { toResultCount: 2 },
      courtRoomFilters: [],
      cases: [
        { name: { forename1: 'Zoe', surname: 'Alpha' }, defendantName: '' },
        { name: { forename1: 'Adam', surname: 'Zulu' }, defendantName: '' }
      ]
    })

    await subject(requestWithDefendantSort, mockResponse)

    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/casesInProgress',
      expect.objectContaining({
        data: [
          expect.objectContaining({ name: { forename1: 'Adam', surname: 'Zulu' } }),
          expect.objectContaining({ name: { forename1: 'Zoe', surname: 'Alpha' } })
        ]
      })
    )
  })

  it('should sort in progress cases by probation status ascending when probation status sort is selected', async () => {
    const requestWithProbationStatusSort = {
      ...mockRequest,
      params: {
        ...mockRequest.params,
        probationStatusSort: 'ascending'
      }
    }

    caseService.getOutcomesList.mockReturnValueOnce({
      totalElements: 2,
      countsByState: { toResultCount: 2 },
      courtRoomFilters: [],
      cases: [
        { probationStatus: 'Possible NDelius record', defendantName: 'Z Last' },
        { probationStatus: 'Current', defendantName: 'A First' }
      ]
    })

    await subject(requestWithProbationStatusSort, mockResponse)

    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/casesInProgress',
      expect.objectContaining({
        data: [
          expect.objectContaining({ probationStatus: 'Current' }),
          expect.objectContaining({ probationStatus: 'Possible NDelius record' })
        ]
      })
    )
  })
})
