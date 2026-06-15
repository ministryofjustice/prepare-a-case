/* global jest, describe, it, expect, beforeEach */
describe('caseSearchHandler', () => {
  const searchByCrnMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

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
  const mockRequest = { query: { term, page: 1 }, cookies: { currentCourt: 'B12345' } }

  const getCaseSearchType = jest.fn()
  const handler = require('../../../server/routes/handlers/getCaseSearchHandler')({ searchCases: searchByCrnMock }, getCaseSearchType)

  it('should invoke the service to search for cases and render template', async () => {
    const data = { items: [], totalElements: 10, totalPages: 5 }
    getCaseSearchType.mockReturnValue({ searchType: 'CRN' })
    searchByCrnMock.mockResolvedValueOnce({ data })

    await handler(mockRequest, mockResponse)
    expect(searchByCrnMock).toHaveBeenCalledWith(term, 'CRN', 1, 20)
    expect(mockResponse.render).toHaveBeenCalledWith('case-search', {
      params: { ...mockRequest.params, courtCode: 'B12345' },
      data: { ...data },
      term,
      currentPage: 1,
      pageSize: 20,
      pagination: {
        pageItems: [
          {
            selected: true,
            type: null,
            href: '/case-search?term=C123456&page=1',
            text: 1
          }
        ],
        previousLink: null,
        nextLink: null
      }
    })
  })

  it('should invoke the service to search for cases by URN and render template', async () => {
    const urnTerm = '01WW0298121'
    const urnRequest = { query: { term: urnTerm, page: 1 }, cookies: { currentCourt: 'B12345' } }
    const data = { items: [], totalElements: 3, totalPages: 1 }
    getCaseSearchType.mockReturnValue({ searchType: 'URN' })
    searchByCrnMock.mockResolvedValueOnce({ data })

    await handler(urnRequest, mockResponse)
    expect(searchByCrnMock).toHaveBeenCalledWith(urnTerm, 'URN', 1, 20)
    expect(mockResponse.render).toHaveBeenCalledWith('case-search', {
      params: { ...urnRequest.params, courtCode: 'B12345' },
      data: { ...data },
      term: urnTerm,
      currentPage: 1,
      pageSize: 20,
      pagination: {
        pageItems: [
          {
            selected: true,
            type: null,
            href: '/case-search?term=01WW0298121&page=1',
            text: 1
          }
        ],
        previousLink: null,
        nextLink: null
      }
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
