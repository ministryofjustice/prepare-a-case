/* global jest, describe, it, expect */

describe('getCaseListRouteHandler', () => {

  const { caseServiceMock: caseService, mockResponse } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getCaseListRouteHandler')(caseService)
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { courtCode: 'ABC', date: '2020-11-11', limit: 10 },
    query: { page: 1 },
    session: {},
    path: '/SHF/cases'
  }

  it('should render error page when getCaseList returns errors', async () => {
    // Given
    caseService.getCaseList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getCaseList).toHaveBeenCalled()
    expect(caseService.getCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('error', { status: 500 })
  })

  it('should successfully render case list returned by getCaseList', async () => {
    // Given
    caseService.getCaseList.mockReturnValueOnce({
      totalCount: 4,
      addedCount: 2,
      removedCount: 2,
      unmatchedRecords: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [{}, {}, {}, {}],
      snapshot: '2020-10-10'
    })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getCaseList).toHaveBeenCalled()
    expect(caseService.getCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [{}, {}, {}, {}],
        params: {
          addedCount: 2,
          caseCount: 4,
          courtCode: 'ABC',
          date: '2020-11-11',
          filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
          filtersApplied: false,
          from: 0,
          limit: 10,
          notification: '',
          page: 1,
          removedCount: 2,
          snapshot: '2020-10-10',
          subsection: '',
          to: 4,
          totalCount: 4,
          totalDays: 7,
          unmatchedRecords: 2
        }
      })
  })
})
