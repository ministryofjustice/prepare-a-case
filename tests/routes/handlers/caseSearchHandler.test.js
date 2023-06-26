/* global jest, describe, it, expect */
describe('caseSearchHandler', () => {
  const searchByCrnMock = jest.fn()

  const mockResponse = {
    locals:
      {
        user: {
          userId: 'user-one'
        }
      },
    render: jest.fn()
  }
  const term = 'C123456'
  const mockRequest = { query: { term, page: 2 } }

  const getCaseSearchType = jest.fn()
  const handler = require('../../../server/routes/handlers/getCaseSearchHandler')({ searchCases: searchByCrnMock }, getCaseSearchType)

  it('should invoke the service to search for cases and render template', async () => {
    const data = { items: [], totalElements: 10, totalPages: 5 }
    getCaseSearchType.mockReturnValue({ searchType: 'CRN' })
    searchByCrnMock.mockResolvedValueOnce({ data })

    await handler(mockRequest, mockResponse)
    expect(searchByCrnMock).toHaveBeenCalledWith(term, 'CRN', 2, 20)
    expect(mockResponse.render).toHaveBeenCalledWith('case-search', {
      params: mockRequest.params,
      data: { ...data },
      term,
      currentPage: 2,
      pageSize: 20
    })
  })

  it('should render template with error when getCaseSearchType resolves to error', async () => {
    const data = { items: [], totalElements: 10, totalPages: 5 }
    getCaseSearchType.mockReturnValue({ error: 'Invalid CRN' })

    searchByCrnMock.mockResolvedValueOnce({ data })

    await handler(mockRequest, mockResponse)
    expect(searchByCrnMock).not.toHaveBeenCalled()
    expect(mockResponse.render).not.toHaveBeenCalledWith('case-search', {
      searchError: 'Invalid CRN'
    })
  })
})
