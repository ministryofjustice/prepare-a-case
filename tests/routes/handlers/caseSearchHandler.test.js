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
  const mockRequest = { query: { term, page: 1 }, cookies: { currentCourt: 'B12345' } }

  const getCaseSearchType = jest.fn()
  const handler = require('../../../server/routes/handlers/getCaseSearchHandler')({ searchCases: searchByCrnMock }, getCaseSearchType)

  it('should invoke the service to search for cases and render template', async () => {
    const data = { items: [], totalElements: 10, totalPages: 5 }
    getCaseSearchType.mockReturnValue({ searchType: 'CRN' })
    searchByCrnMock.mockResolvedValueOnce({ data })

    await handler(mockRequest, mockResponse)
    expect(searchByCrnMock).toHaveBeenCalledWith(term, 'CRN', 1, 20, 'DESC')
    expect(mockResponse.render).toHaveBeenCalledWith('case-search', {
      params: { ...mockRequest.params, courtCode: 'B12345', hearingOutcomesEnabled: false, nextHearingDateSort: 'descending' },
      data: { ...data },
      term,
      searchType: 'CRN',
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

  it('should trim the search term before classifying and searching', async () => {
    const data = { items: [], totalElements: 1, totalPages: 1 }
    const paddedTerm = '  C123456  '
    getCaseSearchType.mockReturnValue({ searchType: 'CRN' })
    searchByCrnMock.mockResolvedValueOnce({ data })

    await handler({ ...mockRequest, query: { ...mockRequest.query, term: paddedTerm } }, mockResponse)

    expect(getCaseSearchType).toHaveBeenCalledWith('C123456')
    expect(searchByCrnMock).toHaveBeenCalledWith('C123456', 'CRN', 1, 20, 'DESC')
    expect(mockResponse.render).toHaveBeenCalledWith('case-search', expect.objectContaining({ term: 'C123456' }))
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
