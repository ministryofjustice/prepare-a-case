/* global jest, describe, it, expect, beforeEach */

const { settings } = require('../../../server/config')

jest.mock('../../../server/utils/nunjucksComponents', () => {
  return {
    getFilterComponent: jest.fn(),
    populateTemplateValuesWithComponent: (input) => { return input }
  }
})

describe('getPagedCaseListRouteHandler', () => {
  const { caseServiceMock: caseService, mockResponse } = require('./test-helpers')
  const userPreferenceService = {
    getFilters: jest.fn().mockResolvedValue({}),
    setFilters: jest.fn().mockResolvedValue()
  }
  const subject = require('../../../server/routes/handlers/getPagedCaseListRouteHandler')(caseService, userPreferenceService)

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

  const createMockRequest = (overrides = {}) => ({
    redisClient: { getAsync: jest.fn().mockResolvedValue(null) },
    params: { courtCode: 'ABC', date: '2020-11-11', limit: 10 },
    query: { page: 1 },
    session: {},
    path: '/SHF/cases',
    flash: jest.fn().mockReturnValue([]),
    ...overrides
  })

  const standardCaseListResponse = (overrides = {}) => ({
    possibleMatchesCount: 2,
    recentlyAddedCount: 2,
    removedCount: undefined,
    filters: [{ label: 'Probation status' }, { label: 'Courtroom' }, { label: 'Session' }],
    cases: [mockCase(), mockCase(), mockCase(), mockCase()],
    totalElements: 4,
    ...overrides
  })

  const paginatedCaseListResponse = (overrides = {}) => ({
    possibleMatchesCount: 0,
    recentlyAddedCount: 0,
    removedCount: 0,
    filters: [],
    cases: Array.from({ length: 20 }, () => mockCase()),
    totalElements: 40,
    ...overrides
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.replaceProperty(settings, 'casesTotalDays', 13)
    jest.replaceProperty(settings, 'casesPastDays', 6)
    jest.replaceProperty(settings, 'enableWorkflow', true)
  })

  it('should render error page when getPagedCaseList returns errors', async () => {
    // Given
    const mockRequest = createMockRequest({
      query: { page: 1, someFilter: 'someFilterValue' }
    })
    caseService.getPagedCaseList.mockReturnValueOnce({ isError: true, status: 500 })

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { someFilter: 'someFilterValue' }, false, 1, 20, expect.any(Boolean))
    expect(mockResponse.render).toHaveBeenCalledWith('error', { status: 500 })
  })

  it('should successfully render case list returned by getPagedCaseList', async () => {
    // Given
    const mockRequest = createMockRequest({
      query: { page: 1, someFilter: 'someFilterValue' }
    })

    caseService.getPagedCaseList.mockReturnValueOnce(standardCaseListResponse())

    jest.replaceProperty(settings, 'enablePastCasesNavigation', true)
    jest.replaceProperty(settings, 'pacEnvironment', 'dev')

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith('case-list', expect.anything())

    expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
      title: 'Cases',
      data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
      params: {
        hearingOutcomesEnabled: expect.any(Boolean),
        workflow,
        addedCount: 2,
        removedCount: undefined,
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
        pageItems: [{ text: 1, href: '/ABC/cases/2020-11-11?someFilter=someFilterValue&page=1', selected: true, type: null }]
      },
      tableData: expect.objectContaining({
        head: expect.any(Array),
        rows: expect.any(Array)
      }),
      hearingOutcomesEnabled: expect.any(Boolean),
      toggleOutcomeSuccessMessage: [],
      globalError: []
    })
  })

  it('should disable past days navigation if enablePastCasesNavigation is not true', async () => {
    // Given
    const mockRequest = createMockRequest({
      query: { page: 1, someFilter: 'someFilterValue' }
    })

    caseService.getPagedCaseList.mockReturnValueOnce(standardCaseListResponse())

    jest.replaceProperty(settings, 'enablePastCasesNavigation', false)
    jest.replaceProperty(settings, 'pacEnvironment', 'dev')

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { someFilter: 'someFilterValue' }, false, 1, 20, expect.any(Boolean))

    expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
      params: {
        enablePastCasesNavigation: false
      }
    })
  })

  it('should add query params to base url (except page)', async () => {
    // Given
    const mockRequest = createMockRequest({
      query: { page: 1, someFilter: 'someFilterValue' }
    })

    caseService.getPagedCaseList.mockReturnValueOnce(standardCaseListResponse())

    jest.replaceProperty(settings, 'enablePastCasesNavigation', false)
    jest.replaceProperty(settings, 'pacEnvironment', 'dev')

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', { someFilter: 'someFilterValue' }, false, 1, 20, expect.any(Boolean))

    expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
      params: {
        baseUrl: '/ABC/cases/2020-11-11?someFilter=someFilterValue&'
      }
    })
  })

  describe('subsection pagination', () => {
    const subsectionTabs = ['added', 'heard', 'removed', 'outcome-not-required']

    it.each(subsectionTabs)(
      'should include subsection in baseUrl for %s tab',
      async (subsection) => {
      // Given
        const mockRequest = createMockRequest({
          params: { courtCode: 'ABC', date: '2020-11-11', limit: 10, subsection },
          query: { page: 1 },
          path: `/ABC/cases/2020-11-11/${subsection}`
        })

        caseService.getPagedCaseList.mockReturnValueOnce(paginatedCaseListResponse())

        jest.replaceProperty(settings, 'enablePastCasesNavigation', false)
        jest.replaceProperty(settings, 'pacEnvironment', 'dev')

        // When
        await subject(mockRequest, mockResponse)

        // Then
        expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
          params: {
            subsection,
            baseUrl: `/ABC/cases/2020-11-11/${subsection}?`
          }
        })
      }
    )

    it.each(subsectionTabs)(
      'should add query params to subsection base url (except page) for %s tab',
      async (subsection) => {
      // Given
        const mockRequest = createMockRequest({
          params: { courtCode: 'ABC', date: '2020-11-11', limit: 10, subsection },
          query: { page: 1, someFilter: 'someFilterValue' },
          path: `/ABC/cases/2020-11-11/${subsection}`
        })

        caseService.getPagedCaseList.mockReturnValueOnce(paginatedCaseListResponse())

        jest.replaceProperty(settings, 'enablePastCasesNavigation', false)
        jest.replaceProperty(settings, 'pacEnvironment', 'dev')

        // When
        await subject(mockRequest, mockResponse)

        // Then
        expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
          params: {
            baseUrl: `/ABC/cases/2020-11-11/${subsection}?someFilter=someFilterValue&`
          }
        })
      }
    )

    it.each(subsectionTabs)(
      'should generate pagination links with subsection for %s tab',
      async (subsection) => {
      // Given
        const mockRequest = createMockRequest({
          params: { courtCode: 'ABC', date: '2020-11-11', limit: 10, subsection },
          query: { page: 1 },
          path: `/ABC/cases/2020-11-11/${subsection}`
        })

        caseService.getPagedCaseList.mockReturnValueOnce(paginatedCaseListResponse())

        jest.replaceProperty(settings, 'enablePastCasesNavigation', false)
        jest.replaceProperty(settings, 'pacEnvironment', 'dev')

        // When
        await subject(mockRequest, mockResponse)

        // Then
        const renderArgs = mockResponse.render.mock.calls[0][1]

        expect(renderArgs.pagination.nextLink).toMatchObject({
          text: 'Next',
          href: `/ABC/cases/2020-11-11/${subsection}?page=2`
        })

        expect(renderArgs.pagination.pageItems).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              text: 1,
              href: `/ABC/cases/2020-11-11/${subsection}?page=1`,
              selected: true
            }),
            expect.objectContaining({
              text: 2,
              href: `/ABC/cases/2020-11-11/${subsection}?page=2`,
              selected: false
            })
          ])
        )
      }
    )

    it.each(subsectionTabs)(
      'should preserve subsection and query params in pagination links for %s tab',
      async (subsection) => {
      // Given
        const mockRequest = createMockRequest({
          params: { courtCode: 'ABC', date: '2020-11-11', limit: 10, subsection },
          query: { page: 1, someFilter: 'someFilterValue' },
          path: `/ABC/cases/2020-11-11/${subsection}`
        })

        caseService.getPagedCaseList.mockReturnValueOnce(paginatedCaseListResponse())

        jest.replaceProperty(settings, 'enablePastCasesNavigation', false)
        jest.replaceProperty(settings, 'pacEnvironment', 'dev')

        // When
        await subject(mockRequest, mockResponse)

        // Then
        const renderArgs = mockResponse.render.mock.calls[0][1]

        expect(renderArgs.pagination.nextLink).toMatchObject({
          text: 'Next',
          href: `/ABC/cases/2020-11-11/${subsection}?someFilter=someFilterValue&page=2`
        })

        expect(renderArgs.pagination.pageItems).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              text: 1,
              href: `/ABC/cases/2020-11-11/${subsection}?someFilter=someFilterValue&page=1`,
              selected: true
            }),
            expect.objectContaining({
              text: 2,
              href: `/ABC/cases/2020-11-11/${subsection}?someFilter=someFilterValue&page=2`,
              selected: false
            })
          ])
        )
      }
    )
  })
})
