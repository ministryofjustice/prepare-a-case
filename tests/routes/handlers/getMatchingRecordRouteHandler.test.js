/* global describe, it, expect, jest */

describe('getMatchingRecordRouteHandler', () => {
  const getMatchDetailsMock = jest.fn()
  const getCaseAndTemplateValuesMock = jest.fn()
  const mockResponse = {
    render: jest.fn()
  }

  const getMatchingRecordRouteHandler = require('../../../server/routes/handlers/getMatchingRecordRouteHandler')(getMatchDetailsMock, getCaseAndTemplateValuesMock)

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

  jest.mock('../../../server/config', () => ({ settings: settingsMock }))
  jest.mock('../../../server/routes/helpers') // Mock the module
  const { getPaginationObject } = require('../../../server/routes/helpers')

  it('should render match-defendant template with paginated data', async () => {
    // Given
    getCaseAndTemplateValuesMock.mockReturnValueOnce(mockTemplateValues)
    getMatchDetailsMock.mockReturnValueOnce(mockMatchingDetailsResponse)
    const paginationObject = { /* pagination details */ }
    jest.spyOn(require('../../../server/routes/helpers'), 'getPaginationObject').mockReturnValue(paginationObject)

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
        pagination: paginationObject
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

  it('should default to page 1 when page query param is invalid', async () => {
    // Given
    mockRequest.query.page = 'invalid' // Invalid page number
    getCaseAndTemplateValuesMock.mockReturnValueOnce(mockTemplateValues)
    getMatchDetailsMock.mockReturnValueOnce(mockMatchingDetailsResponse)

    // Mock the getPaginationObject to return something or spy on it
    getPaginationObject.mockReturnValueOnce({ page: 1 })

    // When
    await getMatchingRecordRouteHandler(mockRequest, mockResponse)

    // Then
    expect(getPaginationObject).toHaveBeenCalledWith(expect.objectContaining({ page: 1 })) // page should default to 1
    expect(mockResponse.render).toHaveBeenCalledWith('match-defendant', expect.any(Object))
  })
})
