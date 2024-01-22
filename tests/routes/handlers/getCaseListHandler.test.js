/* global jest, describe, it, expect */

const { settings } = require('../../../server/config')

describe('getCaseListHandler', () => {
  const { caseServiceMock: caseService, mockResponse } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getCaseListHandler')(caseService)
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { courtCode: 'ABC', date: '2020-11-11' },
    query: { page: 1 },
    session: {},
    path: '/SHF/cases'
  }

  it('should render error page when getPagedCaseList returns errors', async () => {
    // Given
    caseService.getPagedCaseList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false, 1, 10, true)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('error', { status: 500 })
  })

  it('should successfully render case list returned by getPagedCaseList', async () => {
    // Given
    caseService.getPagedCaseList.mockReturnValueOnce({

      possibleMatchesCount: 2,
      recentlyAddedCount: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [{}, {}, {}, {}],
      totalElements: 4
    })

    settings.enablePastCasesNavigation = true
    settings.pacEnvironment = 'dev'

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false, 1, 10, true)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [{}, {}, {}, {}],
        params: {
          hearingOutcomesEnabled: true,
          addedCount: 2,
          caseCount: 4,
          courtCode: 'ABC',
          date: '2020-11-11',
          filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
          filtersApplied: false,
          from: 0,
          notification: '',
          page: 1,
          subsection: '',
          to: 4,
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: true
        },
        hearingOutcomesEnabled: true
      })
  })

  it('should disable past days navigation if enablePastCasesNavigation is not true', async () => {
    // Given
    caseService.getPagedCaseList.mockReturnValueOnce({
      possibleMatchesCount: 2,
      recentlyAddedCount: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [{}, {}, {}, {}],
      totalElements: 4
    })

    settings.enablePastCasesNavigation = false

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false, 1, 10, true)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [{}, {}, {}, {}],
        params: {
          hearingOutcomesEnabled: true,
          addedCount: 2,
          caseCount: 4,
          courtCode: 'ABC',
          date: '2020-11-11',
          filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
          filtersApplied: false,
          from: 0,
          notification: '',
          page: 1,
          subsection: '',
          to: 4,
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: false
        },
        hearingOutcomesEnabled: true
      })
  })
})
