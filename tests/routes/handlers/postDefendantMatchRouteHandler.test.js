/* global beforeEach, describe, it, expect, jest */

const postDefendantMatchRouteHandler = require('../../../server/routes/handlers/postDefendantMatchRouteHandler')
const { getMatchedUrl } = require('../../../server/routes/helpers')

jest.mock('../../../server/routes/helpers')

describe('postDefendantMatchRouteHandler', () => {
  let mockRequest, mockResponse, updateCaseDetailsMock

  beforeEach(() => {
    updateCaseDetailsMock = jest.fn()
    mockRequest = {
      params: {
        courtCode: 'test-court',
        caseId: 'test-case-id',
        hearingId: 'test-hearing-id',
        defendantId: 'test-defendant-id'
      },
      body: { crn: 'CRN123' },
      session: {
        matchType: 'bulk',
        matchDate: '2024-11-11',
        matchName: 'John Doe'
      }
    }
    mockResponse = {
      redirect: jest.fn()
    }
    getMatchedUrl.mockReturnValue('test-url')
  })

  it('should redirect to try again URL and set session error if crn is missing', async () => {
    mockRequest.body.crn = null // Missing crn
    const expectedRedirect = '/test-court/case/test-case-id/hearing/test-hearing-id/match/defendant/test-defendant-id'

    await postDefendantMatchRouteHandler(updateCaseDetailsMock)(mockRequest, mockResponse)

    expect(mockRequest.session.confirmedMatch).toBeUndefined()
    expect(mockRequest.session.formError).toBe(true)
    expect(mockResponse.redirect).toHaveBeenCalledWith(302, expectedRedirect)
  })

  it('should set session.confirmedMatch and redirect to matched URL if updateCaseDetails is successful', async () => {
    updateCaseDetailsMock.mockResolvedValue({ status: 200 })

    await postDefendantMatchRouteHandler(updateCaseDetailsMock)(mockRequest, mockResponse)

    expect(mockRequest.session.confirmedMatch).toEqual({
      name: 'John Doe',
      matchType: 'Known'
    })
    expect(mockResponse.redirect).toHaveBeenCalledWith(302, '/test-court/case/test-case-id/hearing/test-hearing-id/match/defendant/test-defendant-id')
  })

  it('should set session.serverError and redirect to try again URL if updateCaseDetails fails', async () => {
    updateCaseDetailsMock.mockResolvedValue({ status: 400 })
    const expectedRedirect = '/test-court/case/test-case-id/hearing/test-hearing-id/match/defendant/test-defendant-id'

    await postDefendantMatchRouteHandler(updateCaseDetailsMock)(mockRequest, mockResponse)

    expect(mockRequest.session.serverError).toBe(true)
    expect(mockResponse.redirect).toHaveBeenCalledWith(302, expectedRedirect)
  })

  it('should set session.serverError and redirect to try again URL if updateCaseDetails throws an error', async () => {
    updateCaseDetailsMock.mockRejectedValue(new Error('Update failed'))
    const expectedRedirect = '/test-court/case/test-case-id/hearing/test-hearing-id/match/defendant/test-defendant-id'

    await postDefendantMatchRouteHandler(updateCaseDetailsMock)(mockRequest, mockResponse)

    expect(mockRequest.session.serverError).toBe(true)
    expect(mockResponse.redirect).toHaveBeenCalledWith(302, expectedRedirect)
  })
})
