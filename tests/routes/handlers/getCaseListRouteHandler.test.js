/* global jest, describe, it, beforeEach, expect */

const { settings } = require('../../../server/config')

const mockCase = () => ({
  workflow: {
    tasks: [{
      id: 'prep',
      state: 'COMPLETE'
    }]
  }
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

beforeEach(() => {
  jest.replaceProperty(settings, 'casesTotalDays', 13)
  jest.replaceProperty(settings, 'casesPastDays', 6)
  jest.replaceProperty(settings, 'enableWorkflow', true)
})

describe('getCaseListRouteHandler', () => {
  const { caseServiceMock: caseService, mockResponse } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getCaseListRouteHandler')(caseService)
  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { courtCode: 'ABC', date: '2020-11-11', limit: 10 },
    query: { page: 1 },
    session: {},
    path: '/SHF/cases',
    locals: { username: 'testuser' }
  }

  it('should render error page when getCaseList returns errors', async () => {
    // Given
    caseService.getCaseList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getCaseList).toHaveBeenCalled()
    expect(caseService.getCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { page: 1 }, false)
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
      cases: [mockCase(), mockCase(), mockCase(), mockCase()],
      snapshot: '2020-10-10'
    })

    jest.replaceProperty(settings, 'enablePastCasesNavigation', true)
    jest.replaceProperty(settings, 'pacEnvironment', 'dev')

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getCaseList).toHaveBeenCalled()
    expect(caseService.getCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { page: 1 }, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
        params: {
          workflow,
          hearingOutcomesEnabled: false,
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
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: true,
          baseUrl: '/ABC/cases/2020-11-11?'
        },
        hearingOutcomesEnabled: false
      })
  })

  it('should disable past days navigation if enablePastCasesNavigation is not true', async () => {
    // Given
    caseService.getCaseList.mockReturnValueOnce({
      totalCount: 4,
      addedCount: 2,
      removedCount: 2,
      unmatchedRecords: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [mockCase(), mockCase(), mockCase(), mockCase()],
      snapshot: '2020-10-10'
    })

    jest.replaceProperty(settings, 'enablePastCasesNavigation', false)

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getCaseList).toHaveBeenCalled()
    expect(caseService.getCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { page: 1 }, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
        params: {
          workflow,
          hearingOutcomesEnabled: false,
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
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: false,
          baseUrl: '/ABC/cases/2020-11-11?'
        },
        hearingOutcomesEnabled: false
      })
  })

  it('should add query params to base url (except page)', async () => {
    // Given
    caseService.getCaseList.mockReturnValueOnce({
      totalCount: 4,
      addedCount: 2,
      removedCount: 2,
      unmatchedRecords: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [mockCase(), mockCase(), mockCase(), mockCase()],
      snapshot: '2020-10-10'
    })

    jest.replaceProperty(settings, 'enablePastCasesNavigation', false)

    // When
    mockRequest.query = { ...mockRequest.query, someQueryParam: 'some-param-value' }
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Cases',
        data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
        params: {
          workflow,
          hearingOutcomesEnabled: false,
          addedCount: 2,
          caseCount: 4,
          courtCode: 'ABC',
          date: '2020-11-11',
          filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
          filtersApplied: true,
          from: 0,
          limit: 10,
          notification: '',
          page: 1,
          removedCount: 2,
          snapshot: '2020-10-10',
          subsection: '',
          to: 4,
          totalCount: 4,
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: false,
          baseUrl: '/ABC/cases/2020-11-11?someQueryParam=some-param-value&'
        },
        hearingOutcomesEnabled: false
      })
  })
})
