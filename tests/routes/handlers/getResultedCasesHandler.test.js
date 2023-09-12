/* global describe, it, expect, jest */
const getOutcomeTypesListFilters = require('.././../../server/utils/getOutcomeTypesListFilters')

describe('getResultedCasesHandler', () => {
  const {
    caseServiceMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/outcomes/getResultedCasesHandler')(caseServiceMock)
  const courtCode = 'B007'

  const params = { title: 'Resulted cases', sorts: { sorts: 'hearingDate', order: 'ASC' }, courtCode, state: 'RESULTED', casesInProgressCount: 2 }
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params,
    path: '/test/path',
    session: {}
  }

  it('should invoke get hearing outcomes for RESULTED state', async () => {
    // Given
    caseServiceMock.getOutcomesList.mockResolvedValueOnce({ cases: [{}, {}] })

    // When
    await subject(mockRequest, mockResponse)
    const filters = getOutcomeTypesListFilters({})
    // Then
    expect(caseServiceMock.getOutcomesList).toHaveBeenCalledWith(courtCode, filters, params.sorts, params.state)
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
        data: [{}, {}]
      })
  })
})
