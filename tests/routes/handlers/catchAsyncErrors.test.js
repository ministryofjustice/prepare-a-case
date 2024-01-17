/* global describe, it, expect, jest */

jest.mock('../../../server/log')

describe('catchAsyncErrors', () => {
  const nextMock = jest.fn()
  const handlerMock = jest.fn()
  const testReq = { params: { one: 'one' } }
  const testRes = { params: { render: 'render' } }
  const testError = new Error('Unexpected error')
  const httpBackendHelloEndpoint = 'http://backend-hello-endpoint'
  const testBackendErrorMessage = 'something went wrong in the backend'
  const testAxiosError = {
    message: 'Unexpected error',
    isAxiosError: true,
    code: 'code1',
    config: {
      url: httpBackendHelloEndpoint,
      method: 'GET',
      headers: {
        Authorization: 'Bearer sEcRetToKen'
      }
    },
    response: {
      status: 400,
      data: {
        developerMessage: testBackendErrorMessage
      }
    },
    toString: testError.toString
  }

  const subject = require('../../../server/routes/handlers/catchAsyncErrors')
  const loggerMock = require('../../../server/log')

  it('should catch, log and progress the error to express when handler throws an error', async () => {
    handlerMock.mockRejectedValueOnce(testError)
    const wrappedHandler = subject(handlerMock)
    await wrappedHandler(testReq, testRes, nextMock)
    expect(handlerMock).toHaveBeenCalledWith(testReq, testRes)
    expect(nextMock).toHaveBeenLastCalledWith({ ...testError, status: 500 })
    expect(loggerMock.error).toHaveBeenCalledWith(testError)
  })

  it('should catch, log API error and progress the Axios error to express when handler throws an error', async () => {
    handlerMock.mockRejectedValueOnce(testAxiosError)
    const wrappedHandler = subject(handlerMock)
    await wrappedHandler(testReq, testRes, nextMock)
    const expectedAxiosError = {
      ...testAxiosError,
      config: {
        ...testAxiosError.config,
        headers: {
          ...testAxiosError.config.headers,
          Authorization: '***'
        }
      }
    }

    expect(handlerMock).toHaveBeenCalledWith(testReq, testRes)
    expect(nextMock).toHaveBeenLastCalledWith({ ...expectedAxiosError, status: 400 })
    expect(loggerMock.error.mock.calls).toEqual([[expectedAxiosError],
      [{ type: 'API Error', code: 'code1', URL: httpBackendHelloEndpoint, method: 'GET', httpStatus: 400, message: testBackendErrorMessage }, 'Error: Unexpected error']
    ])
  })

  it('should catch, log API error, default status to 500 when response is undefined', async () => {
    const testAxiosErrorConnRefused = {
      ...testAxiosError,
      response: undefined
    }
    handlerMock.mockRejectedValueOnce(testAxiosErrorConnRefused)
    const wrappedHandler = subject(handlerMock)
    await wrappedHandler(testReq, testRes, nextMock)
    expect(handlerMock).toHaveBeenCalledWith(testReq, testRes)
    expect(nextMock).toHaveBeenLastCalledWith({ ...testAxiosErrorConnRefused, status: 500 })
    expect(loggerMock.error.mock.calls).toEqual([[testAxiosErrorConnRefused],
      [{ type: 'API Error', code: 'code1', URL: httpBackendHelloEndpoint, method: 'GET', httpStatus: 500, message: undefined }, 'Error: Unexpected error']
    ])
  })
})
