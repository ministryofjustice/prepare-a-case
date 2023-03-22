/* global jest, describe, it, expect */
describe('searchByDefendant', () => {
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
  const crn = 'C123'
  const mockRequest = { query: { crn } }

  const handler = require('../../../server/routes/handlers/searchByDefendant')({ searchByCrn: searchByCrnMock })

  it('should invoke the service to search for cases and render template', async () => {
    const data = { items: [] }
    searchByCrnMock.mockResolvedValueOnce({ data })

    await handler(mockRequest, mockResponse)
    expect(searchByCrnMock).toHaveBeenCalledWith(crn)
    expect(mockResponse.render).toHaveBeenCalledWith('case-search', {
      params: mockRequest.params,
      data: { ...data, crn }
    })
  })
})
