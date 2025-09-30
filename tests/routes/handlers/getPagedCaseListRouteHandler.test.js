/* global jest, describe, it, expect, beforeEach */

const { settings } = require('../../../server/config')

jest.mock('../../../server/utils/nunjucksComponents', () => {
  return {
    getFilterComponent: jest.fn(),
    populateTemplateValuesWithComponent: (input) => { return input }
  }
})

describe('getPagedCaseListRouteHandler', () => {
  beforeEach(() => {
    jest.replaceProperty(settings, 'casesTotalDays', 13)
    jest.replaceProperty(settings, 'casesPastDays', 6)
    jest.replaceProperty(settings, 'enableWorkflow', true)
  })

  const { caseServiceMock: caseService, mockResponse } = require('./test-helpers')
  const userPreferenceService = { getFilters: jest.fn().mockResolvedValue({}), setFilters: jest.fn().mockResolvedValue() }
  const subject = require('../../../server/routes/handlers/getPagedCaseListRouteHandler')(caseService, userPreferenceService)
  const mockRequest = {
    redisClient: { getAsync: jest.fn().mockResolvedValue(null) },
    params: { courtCode: 'ABC', date: '2020-11-11', limit: 10 },
    query: { page: 1 },
    session: {},
    path: '/SHF/cases'
  }

  const mockCase = () => ({
    courtRoom: 'Some courtroom',
    probationStatus: 'Some status',
    offences: [],
    session: 'MORNING',
    hearingPrepStatus: 'COMPLETE'
  })

  const mockCaseResult = () => ({
    courtRoom: 'Some courtroom',
    probationStatus: 'Some status',
    offences: [],
    session: 'MORNING',
    hearingPrepStatus: 'COMPLETE',
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

    mockRequest.query = { ...mockRequest.query, someFilter: 'someFilterValue' }

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { someFilter: 'someFilterValue' }, false, 1, 20, expect.any(Boolean))
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
    mockRequest.query = { ...mockRequest.query, someFilter: 'someFilterValue' }
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { someFilter: 'someFilterValue' }, false, 1, 20, expect.any(Boolean))
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Case list',
        data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
        params: {
          hearingOutcomesEnabled: expect.any(Boolean),
          workflow,
          addedCount: 2,
          removedCount: undefined,
          outcomeNotRequiredCount: undefined,
          caseCount: 4,
          courtCode: 'ABC',
          date: '2020-11-11',
          filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
          filtersApplied: true,
          from: 0,
          limit: 10,
          notification: '',
          page: 1,
          subsection: '',
          to: 4,
          totalDays: 13,
          casesPastDays: 6,
          unmatchedRecords: 2,
          enablePastCasesNavigation: true,
          baseUrl: '/ABC/cases/2020-11-11?someFilter=someFilterValue&'
        },
        listTabs: expect.any(Array),
        pagination: {
          totalPages: 1,
          pageItems: [{ text: 1, href: '/ABC/cases/2020-11-11?someFilter=someFilterValue&page=1', selected: true, type: null }],
          recentlyAddedPageItems: [{ text: 1, href: '/ABC/cases/2020-11-11/?page=1', selected: true, type: null }],
          previousLink: null,
          recentlyAddedPreviousLink: null,
          nextLink: null,
          recentlyAddedNextLink: null
        },
        tableData: expect.objectContaining({
          head: expect.any(Array),
          rows: expect.any(Array)
        }),
        hearingOutcomesEnabled: expect.any(Boolean)
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
    jest.replaceProperty(settings, 'pacEnvironment', 'dev')

    // When
    mockRequest.query = { ...mockRequest.query, someFilter: 'someFilterValue' }
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { someFilter: 'someFilterValue' }, false, 1, 20, expect.any(Boolean))
    expect(mockResponse.render).toHaveBeenCalled()

    expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
      params: {
        enablePastCasesNavigation: false
      }
    })
  })

  it('should add query params to base url (except page)', async () => {
    // Given
    caseService.getPagedCaseList.mockReturnValueOnce({
      possibleMatchesCount: 2,
      recentlyAddedCount: 2,
      filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
      cases: [mockCase(), mockCase(), mockCase(), mockCase()],
      totalElements: 4
    })

    jest.replaceProperty(settings, 'enablePastCasesNavigation', false)
    jest.replaceProperty(settings, 'pacEnvironment', 'dev')

    // When
    mockRequest.query = { ...mockRequest.query, someFilter: 'someFilterValue' }
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { someFilter: 'someFilterValue' }, false, 1, 20, expect.any(Boolean))
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list', expect.anything())

    expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
      params: {
        baseUrl: '/ABC/cases/2020-11-11?someFilter=someFilterValue&'
      }
    })
  })
})
