/* global describe, it, expect, jest */

describe('getMatchingRecordRouteHandler', () => {
  const getMatchDetailsMock = jest.fn()
  const getCaseAndTemplateValuesMock = jest.fn()
  const mockResponse = {
    render: jest.fn()
  }

  const getMatchingRecordRouteHandler = require('../../../../server/routes/handlers/matchRecords/matchingRecordRouteHandler')(getMatchDetailsMock, getCaseAndTemplateValuesMock)

  const mockRequest = {
    params: { courtCode: 'test-court', caseId: 'test-case-id', hearingId: 'test-hearing-id', defendantId: 'test-defendant-id' },
    query: { page: 1 },
    session: {},
    path: '/test/path'
  }

  const mockTemplateValues = {
    title: 'Review possible NDelius records',
    data: {
      defendantName: 'John Doe'
    }
  }

  const mockMatchingDetailsResponse = {
    offenderMatchDetails: [
      { id: 1, name: 'John Doe', crn: '12345' },
      { id: 2, name: 'Jane Doe', crn: '67890' }
    ]
  }

  const settingsMock = {
    matchingRecordsToBeShownPerPage: 10
  }

  jest.mock('../../../../server/config', () => ({ settings: settingsMock }))
  jest.mock('../../../../server/routes/helpers') // Mock the module

  it('should render match-defendant template with paginated data', async () => {
    // Given
    getCaseAndTemplateValuesMock.mockReturnValueOnce(mockTemplateValues)
    getMatchDetailsMock.mockReturnValueOnce(mockMatchingDetailsResponse)
    const paginationObject = {
      nextLink: null,
      previousLink: null,
      pageItems: [
        {
          selected: true,
          type: null,
          href: '/test-court/case/test-case-id/hearing/test-hearing-id/match/defendant/test-defendant-id?page=1',
          text: 1
        }
      ]
    }
    jest.spyOn(require('../../../../server/utils/pagination'), 'getPagination').mockReturnValue(paginationObject)

    // When
    await getMatchingRecordRouteHandler(mockRequest, mockResponse)

    // Then
    expect(getCaseAndTemplateValuesMock).toHaveBeenCalledWith(mockRequest)
    expect(getMatchDetailsMock).toHaveBeenCalledWith(mockRequest.params.defendantId)
    expect(mockResponse.render).toHaveBeenCalledWith('match-defendant', {
      ...mockTemplateValues,
      session: {},
      data: {
        ...mockTemplateValues.data,
        matchData: mockMatchingDetailsResponse.offenderMatchDetails.slice(0, settingsMock.matchingRecordsToBeShownPerPage),
        pagination: {
          ...paginationObject,
          matchingRecordsCount: 2,
          totalPages: 1,
          from: 0,
          to: 2
        }
      }
    })
  })

  it('should render error when offenderMatchDetails is not an array', async () => {
    // Given
    getCaseAndTemplateValuesMock.mockReturnValueOnce(mockTemplateValues)
    getMatchDetailsMock.mockReturnValueOnce({ offenderMatchDetails: null }) // Simulate invalid data

    // When
    await getMatchingRecordRouteHandler(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith('error', {
      status: 500
    })
  })

  it('should render error when no match details are found', async () => {
    // Given
    getCaseAndTemplateValuesMock.mockReturnValueOnce(mockTemplateValues)
    getMatchDetailsMock.mockReturnValueOnce({ offenderMatchDetails: [] }) // No matches

    // When
    await getMatchingRecordRouteHandler(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalledWith('error', {
      status: 500
    })
  })
})
