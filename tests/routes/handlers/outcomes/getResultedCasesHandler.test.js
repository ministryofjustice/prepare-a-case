/* global describe, it, expect, jest */
const getOutcomeTypesListFilters = require('../.././../../server/utils/getOutcomeTypesListFilters')
const getAssignedToFilters = require('../.././../../server/utils/getHearingOutcomeAssignedToFilters')

jest.mock('../.././../../server/utils/getOutcomeTypesListFilters', () => {
  return jest.fn(() => ({
    id: 'outcomeType',
    label: 'Outcome type',
    items: [
      { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
      { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
      { label: 'Report requested', value: 'REPORT_REQUESTED' }]
  }))
})

jest.mock('../.././../../server/utils/nunjucksComponents', () => {
  return {
    getFilterComponent: jest.fn(),
    populateTemplateValuesWithComponent: (input) => { return input }
  }
})

describe('getResultedCasesHandler', () => {
  const { caseServiceMock, mockResponse } = require('../test-helpers')
  const userPreferenceService = { getFilters: jest.fn(), setFilters: jest.fn() }
  const subject =
    require('../../../../server/routes/handlers/outcomes/getResultedCasesHandler')(
      caseServiceMock,
      userPreferenceService
    )
  const courtCode = 'B007'

  const params = {
    title: 'Hearing outcomes - Resulted cases',
    heading: 'Hearing outcomes',
    sorts: { sorts: 'hearingDate', order: 'ASC' },
    courtCode,
    state: 'RESULTED',
    casesInProgressCount: 2,
    currentPage: 1,
    pagingBaseUrl: '/ABC/outcomes/resulted-cases'
  }
  const query = {}
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params,
    path: '/test/path',
    session: {},
    query
  }

  it('should invoke get hearing outcomes for RESULTED state', async () => {
    // Given
    const apiResponse = {
      totalElements: 2,
      cases: [
        { assignedToUuid: 'uuid-one', assignedTo: 'AUthor One' },
        {
          assignedToUuid: 'uuid-two',
          assignedTo: 'Author Two'
        }
      ],
      countsByState: {
        toResultCount: 2,
        inProgressCount: 5
      },
      courtRoomFilters: ['01']
    }
    caseServiceMock.getOutcomesList.mockResolvedValueOnce(apiResponse)

    // When
    await subject(mockRequest, mockResponse)

    const outcomeTypeFilter = await getOutcomeTypesListFilters()

    const assignedToFilters = getAssignedToFilters(apiResponse.cases)

    const filters = [
      outcomeTypeFilter,
      {
        id: 'courtRoom',
        label: 'Courtroom',
        items: [
          {
            label: '1',
            value: ['01']
          }
        ]
      },
      assignedToFilters
    ]
    // Then
    expect(caseServiceMock.getOutcomesList).toHaveBeenCalledWith(
      courtCode,
      query,
      params.sorts,
      params.state
    )
    expect(mockResponse.render).toHaveBeenCalledWith('outcomes/resultedCases', {
      params: {
        ...params,
        filters,
        filtersApplied: false,
        includeDefendantSort: true,
        includeProbationStatusSort: true,
        casesInProgressCount: 5,
        casesToResultCount: 2
      },
      title: params.title,
      currentUserUuid: '78be7d32-d6be-4429-b469-f2b0ba232033',
      data: apiResponse.cases,
      totalElements: 2,
      totalPages: undefined,
      heading: params.heading,
      pagination: {
        pageItems: [],
        previousLink: null,
        nextLink: null
      }
    })
  })

  it('should render the correct heading and title', async () => {
    // Given
    caseServiceMock.getOutcomesList.mockResolvedValueOnce({
      totalElements: 2,
      cases: [{}, {}],
      countsByState: { toResultCount: 2, inProgressCount: 5 },
      courtRoomFilters: ['01']
    })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/resultedCases',
      expect.objectContaining({
        heading: 'Hearing outcomes',
        title: 'Hearing outcomes - Resulted cases'
      })
    )
  })

  it('should sort resulted cases by defendant name ascending when defendant sort is selected', async () => {
    const requestWithDefendantSort = {
      ...mockRequest,
      params: {
        ...params,
        defendantSort: 'ascending'
      }
    }

    caseServiceMock.getOutcomesList.mockResolvedValueOnce({
      totalElements: 2,
      cases: [
        { name: { forename1: 'Zoe', surname: 'Alpha' }, defendantName: '', probationStatus: 'Current' },
        { name: { forename1: 'Adam', surname: 'Zulu' }, defendantName: '', probationStatus: 'Current' }
      ],
      countsByState: { toResultCount: 2, inProgressCount: 5 },
      courtRoomFilters: ['01']
    })

    await subject(requestWithDefendantSort, mockResponse)

    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/resultedCases',
      expect.objectContaining({
        data: [
          expect.objectContaining({ name: { forename1: 'Adam', surname: 'Zulu' } }),
          expect.objectContaining({ name: { forename1: 'Zoe', surname: 'Alpha' } })
        ]
      })
    )
  })

  it('should sort resulted cases by probation status ascending when probation status sort is selected', async () => {
    const requestWithProbationStatusSort = {
      ...mockRequest,
      params: {
        ...params,
        probationStatusSort: 'ascending'
      }
    }

    caseServiceMock.getOutcomesList.mockResolvedValueOnce({
      totalElements: 2,
      cases: [
        { probationStatus: 'Possible NDelius record', defendantName: 'Z Last' },
        { probationStatus: 'Current', defendantName: 'A First' }
      ],
      countsByState: { toResultCount: 2, inProgressCount: 5 },
      courtRoomFilters: ['01']
    })

    await subject(requestWithProbationStatusSort, mockResponse)

    expect(mockResponse.render).toHaveBeenCalledWith(
      'outcomes/resultedCases',
      expect.objectContaining({
        data: [
          expect.objectContaining({ probationStatus: 'Current' }),
          expect.objectContaining({ probationStatus: 'Possible NDelius record' })
        ]
      })
    )
  })
})
