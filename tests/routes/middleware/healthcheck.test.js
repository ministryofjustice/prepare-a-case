/* global describe, beforeEach, afterEach, it, expect, jest */
const { instance: axios } = require('../../../server/routes/middleware/authorisationMiddleware')
const { health } = require('../../../server/routes/middleware/healthcheck')

const mockNext = jest.fn()
const resObj = {
  status: 200,
  render: jest.fn(() => {
    return {
      end: jest.fn()
    }
  })
}
const reqObj = {}
const oldEnv = process.env

describe('Health check middleware', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = {}

    jest.spyOn(axios, 'get').mockImplementation(url => {
      return new Promise(resolve => {
        process.nextTick(() =>
          resolve(resObj)
        )
      })
    })
  })

  afterEach(() => {
    process.env = { ...oldEnv }
    jest.clearAllMocks()
  })

  describe('When the court-case-service is HEALTHY', () => {
    beforeEach(async () => {
      await health(reqObj, resObj, mockNext)
    })

    it('should continue', () => {
      expect(mockNext).toBeCalled()
    })
  })

  describe('When the court-case-service is UNHEALTHY', () => {
    beforeEach(async () => {
      resObj.status = 418
      await health(reqObj, resObj, mockNext)
    })

    it('should redirect', () => {
      expect(mockNext).not.toBeCalled()
      expect(resObj.render).toBeCalledWith('error', { status: 500 })
    })
  })

  describe('When the court-case-service check FAILS', () => {
    beforeEach(async () => {
      jest.spyOn(axios, 'get').mockImplementation(() => {
        throw new Error('FAIL')
      })
      await health(reqObj, resObj, mockNext)
    })

    it('should redirect', () => {
      expect(mockNext).not.toBeCalled()
      expect(resObj.render).toBeCalledWith('error', { status: 500 })
    })
  })
})
