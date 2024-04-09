/* global jest, describe, it, expect, beforeEach */

const { settings } = require('../../../server/config')

beforeEach(() => {
  jest.replaceProperty(settings, 'casesTotalDays', 13)
  jest.replaceProperty(settings, 'casesPastDays', 6)
})

describe('getPagedCaseListRouteHandler', () => {
  const { caseServiceMock: caseService, mockResponse } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getPagedCaseListRouteHandler')(caseService)
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { courtCode: 'ABC', date: '2020-11-11', limit: 10 },
    query: { page: 1 },
    session: {},
    path: '/SHF/cases'
  }

  const mockCase = () => ({
    hearingPrepStatus: 'COMPLETE'
  })

  const mockCaseResult = () => ({
    workflow: {
      tasks: {
        prep: {
          cssClass: 'govuk-tag--green',
          id: 'COMPLETE',
          lang: {
            en: {
              title: 'Complete'
            }
          }
        }
      }
    }
  })

  const workflow = {
    enabled: true,
    tasks: {
      prep: {
        items: require('../../../server/utils/workflow').tasks.get('prep').states.getAllOrderBySequence
      }
    }
  }

  it('should render error page when getPagedCaseList returns errors', async () => {
    // Given
    caseService.getPagedCaseList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false, 1, 20, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('error', { status: 500 })
  })

  it('should successfully render case list returned by getPagedCaseList', async () => {
    // Given
    caseService.getPagedCaseList.mockReturnValueOnce({
      possibleMatchesCount: 2,
      recentlyAddedCount: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [mockCase(), mockCase(), mockCase(), mockCase()],
      totalElements: 4
    })

    jest.replaceProperty(settings, 'enablePastCasesNavigation', true)
    jest.replaceProperty(settings, 'pacEnvironment', 'dev')

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false, 1, 20, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
        params: {
          hearingOutcomesEnabled: false,
          workflow,
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
          subsection: '',
          to: 4,
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: true
        },
        hearingOutcomesEnabled: false
      })
  })

  it('should disable past days navigation if enablePastCasesNavigation is not true', async () => {
    // Given
    caseService.getPagedCaseList.mockReturnValueOnce({
      possibleMatchesCount: 2,
      recentlyAddedCount: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [mockCase(), mockCase(), mockCase(), mockCase()],
      totalElements: 4
    })

    jest.replaceProperty(settings, 'enablePastCasesNavigation', false)

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', undefined, false, 1, 20, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
        params: {
          hearingOutcomesEnabled: false,
          workflow,
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
          subsection: '',
          to: 4,
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: false
        },
        hearingOutcomesEnabled: false
      })
  })
})
