/* global describe, it, expect, jest */
const getOutcomeTypesListFilters = require('.././../../server/utils/getOutcomeTypesListFilters')
const getAssignedToFilters = require('.././../../server/utils/getHearingOutcomeAssignedToFilters')

describe('getResultedCasesHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/outcomes/getResultedCasesHandler')(caseServiceMock)
  const courtCode = 'B007'

  const params = { title: 'Resulted cases', sorts: { sorts: 'hearingDate', order: 'ASC' }, courtCode, state: 'RESULTED', casesInProgressCount: 2 }
  const query = {
  }
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params,
    path: '/test/path',
    session: {},
    query
  }

  it('should invoke get hearing outcomes for RESULTED state', async () => {
    // Given
    const apiResponse = { cases: [{ assignedToUuid: 'uuid-one', assignedTo: 'AUthor One' }, { assignedToUuid: 'uuid-two', assignedTo: 'Author Two' }] }
    caseServiceMock.getOutcomesList.mockResolvedValueOnce(apiResponse)

    // When
    await subject(mockRequest, mockResponse)

    const outcomeTYpeFilter = getOutcomeTypesListFilters()

    const assignedToFilters = getAssignedToFilters(apiResponse.cases)

    const filters = [outcomeTYpeFilter, assignedToFilters]
    // Then
    expect(caseServiceMock.getOutcomesList).toHaveBeenCalledWith(courtCode, query, params.sorts, params.state)
    expect(mockResponse.render).toHaveBeenCalledWith('outcomes/resultedCases',
      {
        params: {
          ...params,
          filters,
          filtersApplied: 0,
          casesInProgressCount: 2
        },
        title: params.title,
        currentUserUuid: '78be7d32-d6be-4429-b469-f2b0ba232033',
        data: apiResponse.cases
      })
  })
})
