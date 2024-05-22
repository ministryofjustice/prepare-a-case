/* global jest, describe, it, expect, beforeEach */

const { settings } = require('../../../server/config')

describe('getPagedCaseListRouteHandler', () => {
  beforeEach(() => {
    jest.replaceProperty(settings, 'casesTotalDays', 13)
    jest.replaceProperty(settings, 'casesPastDays', 6)
    jest.replaceProperty(settings, 'enableWorkflow', true)
  })

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

    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', mockRequest.query, false, 1, 20, false)
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
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', mockRequest.query, false, 1, 20, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list',
      {
        title: 'Case list',
        data: [mockCaseResult(), mockCaseResult(), mockCaseResult(), mockCaseResult()],
        params: {
          hearingOutcomesEnabled: false,
          workflow,
          addedCount: 2,
          removedCount: undefined,
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
          enablePastCasesNavigation: true,
          baseUrl: '/ABC/cases/2020-11-11?'
        },
        listTabs: [
          {
            title: 'Case list',
            a11yTitle: 'View current case list',
            link: '/ABC/cases/2020-11-11',
            current: true
          },
          {
            title: 'Recently added',
            a11yTitle: 'View list of recently added cases',
            link: '/ABC/cases/2020-11-11/added',
            current: false,
            count: 2
          }
        ],
        pagination: {
          maxPagesDisplay: 4,
          currentPage: 1,
          startNum: 1,
          endNum: 1,
          totalPages: 1,
          pageItems: [{ text: 1, href: '/ABC/cases/2020-11-11?page=1', selected: true }],
          recentlyAddedPageItems: [{ text: 1, href: '/ABC/cases/2020-11-11/?page=1', selected: true }],
          previousLink: undefined,
          recentlyAddedPreviousLink: undefined,
          nextLink: undefined,
          recentlyAddedNextLink: undefined
        },
        tableData: {
          head: [
            { text: 'Defendant' },
            { text: 'Probation status' },
            { text: 'Offence' },
            { text: 'Listing' },
            { text: 'Session' },
            { text: 'Court', format: 'numeric' },
            { html: 'Admin prep status' }
          ],
          rows: [
            [
              {
                html: '<a href="/ABC/hearing/undefined/defendant/undefined/summary" class="pac-defendant-link govuk-!-font-weight-bold govuk-link govuk-link--no-visited-state" aria-label="View case for defendant "></a><div class="pac-secondary-text govuk-body-s govuk-!-margin-top-1"></div>'
              },
              { html: 'Some status' },
              {
                html: '<ol class="govuk-list govuk-list--number govuk-!-margin-bottom-0"></ol>'
              },
              { html: '' },
              { text: 'Morning' },
              { text: 'Some courtroom', format: 'numeric' },
              {
                html: '<select class="workflow-tasks-status-selector" aria-label="Admin prep status" data-form-action="/workflow/tasks/prep/state?hearing=undefined&defendant=undefined" data-defendant-fullname=""><option value="NOT_STARTED" data-css-class="govuk-tag--grey">Not started</option><option value="IN_PROGRESS" data-css-class="govuk-tag--light-blue">Ongoing</option><option value="COMPLETE" data-css-class="govuk-tag--green" selected>Complete</option></selec>'
              }
            ],
            [
              {
                html: '<a href="/ABC/hearing/undefined/defendant/undefined/summary" class="pac-defendant-link govuk-!-font-weight-bold govuk-link govuk-link--no-visited-state" aria-label="View case for defendant "></a><div class="pac-secondary-text govuk-body-s govuk-!-margin-top-1"></div>'
              },
              { html: 'Some status' },
              {
                html: '<ol class="govuk-list govuk-list--number govuk-!-margin-bottom-0"></ol>'
              },
              { html: '' },
              { text: 'Morning' },
              { text: 'Some courtroom', format: 'numeric' },
              {
                html: '<select class="workflow-tasks-status-selector" aria-label="Admin prep status" data-form-action="/workflow/tasks/prep/state?hearing=undefined&defendant=undefined" data-defendant-fullname=""><option value="NOT_STARTED" data-css-class="govuk-tag--grey">Not started</option><option value="IN_PROGRESS" data-css-class="govuk-tag--light-blue">Ongoing</option><option value="COMPLETE" data-css-class="govuk-tag--green" selected>Complete</option></selec>'
              }
            ],
            [
              {
                html: '<a href="/ABC/hearing/undefined/defendant/undefined/summary" class="pac-defendant-link govuk-!-font-weight-bold govuk-link govuk-link--no-visited-state" aria-label="View case for defendant "></a><div class="pac-secondary-text govuk-body-s govuk-!-margin-top-1"></div>'
              },
              { html: 'Some status' },
              {
                html: '<ol class="govuk-list govuk-list--number govuk-!-margin-bottom-0"></ol>'
              },
              { html: '' },
              { text: 'Morning' },
              { text: 'Some courtroom', format: 'numeric' },
              {
                html: '<select class="workflow-tasks-status-selector" aria-label="Admin prep status" data-form-action="/workflow/tasks/prep/state?hearing=undefined&defendant=undefined" data-defendant-fullname=""><option value="NOT_STARTED" data-css-class="govuk-tag--grey">Not started</option><option value="IN_PROGRESS" data-css-class="govuk-tag--light-blue">Ongoing</option><option value="COMPLETE" data-css-class="govuk-tag--green" selected>Complete</option></selec>'
              }
            ],
            [
              {
                html: '<a href="/ABC/hearing/undefined/defendant/undefined/summary" class="pac-defendant-link govuk-!-font-weight-bold govuk-link govuk-link--no-visited-state" aria-label="View case for defendant "></a><div class="pac-secondary-text govuk-body-s govuk-!-margin-top-1"></div>'
              },
              { html: 'Some status' },
              {
                html: '<ol class="govuk-list govuk-list--number govuk-!-margin-bottom-0"></ol>'
              },
              { html: '' },
              { text: 'Morning' },
              { text: 'Some courtroom', format: 'numeric' },
              {
                html: '<select class="workflow-tasks-status-selector" aria-label="Admin prep status" data-form-action="/workflow/tasks/prep/state?hearing=undefined&defendant=undefined" data-defendant-fullname=""><option value="NOT_STARTED" data-css-class="govuk-tag--grey">Not started</option><option value="IN_PROGRESS" data-css-class="govuk-tag--light-blue">Ongoing</option><option value="COMPLETE" data-css-class="govuk-tag--green" selected>Complete</option></selec>'
              }
            ]
          ]
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
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', mockRequest.query, false, 1, 20, false)
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

    // When
    mockRequest.query = { ...mockRequest.query, someQueryParam: 'some-param-value' }
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockRequest.redisClient.getAsync).toHaveBeenCalledWith('case-list-notification')
    expect(caseService.getPagedCaseList).toHaveBeenCalled()
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith('ABC', '2020-11-11', mockRequest.query, false, 1, 20, false)
    expect(mockResponse.render).toHaveBeenCalled()
    expect(mockResponse.render).toHaveBeenCalledWith('case-list', expect.anything())

    expect(mockResponse.render.mock.calls[0][1]).toMatchObject({
      params: {
        baseUrl: '/ABC/cases/2020-11-11?someQueryParam=some-param-value&'
      }
    })
  })
})
