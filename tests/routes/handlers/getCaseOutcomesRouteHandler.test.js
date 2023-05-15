/* global describe, it, expect */

describe('getCaseOutcomesRouteHandler', () => {
  const {
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getCaseOutcomesRouteHandler')()
  const courtCode = 'B007'

  const mockRequest = {
    params: { courtCode }
  }

  it('should invoke the route handler and render blank outcomes page', async () => {
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(mockResponse.render).toHaveBeenCalled()
  })
})
