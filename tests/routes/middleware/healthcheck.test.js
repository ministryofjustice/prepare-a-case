/* global describe, beforeEach, afterEach, it, expect, jest */
const axios = require('axios')
const { health } = require('../../../routes/middleware/healthcheck')

const mockNext = jest.fn()
const resolveObj = { status: 200 }
const reqObj = { healthy: false }
const oldEnv = process.env
let axiosSpy

describe('Health check middleware', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...oldEnv }

    axiosSpy = jest.spyOn(axios, 'get').mockImplementation(url => {
      return new Promise(resolve => {
        process.nextTick(() =>
          resolve(resolveObj)
        )
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('When the court-case-service is HEALTHY', () => {
    beforeEach(async () => {
      await health(reqObj, {}, mockNext)
    })

    it('should set healthy flag as TRUE', () => {
      expect(reqObj.healthy).toBeTruthy()
    })

    it('should continue', () => {
      expect(mockNext).toBeCalled()
    })
  })

  describe('When the court-case-service is UNHEALTHY', () => {
    beforeEach(async () => {
      resolveObj.status = 418
      await health(reqObj, {}, mockNext)
    })

    it('should set healthy flag as FALSE', () => {
      expect(reqObj.healthy).toBeFalsy()
    })

    it('should continue', () => {
      expect(mockNext).toBeCalled()
    })
  })

  describe('When the court-case-service check FAILS', () => {
    beforeEach(async () => {
      jest.spyOn(axios, 'get').mockImplementation(() => {
        throw new Error('FAIL')
      })
      await health(reqObj, {}, mockNext)
    })

    it('should set healthy flag as FALSE', () => {
      expect(reqObj.healthy).toBeFalsy()
    })

    it('should continue', () => {
      expect(mockNext).toBeCalled()
    })
  })

  describe('Health check should use environment variables for court-case-service URL', () => {
    it('should GET from localhost if no env var is set', async () => {
      await health(reqObj, {}, mockNext)
      expect(axiosSpy).toBeCalledWith('http://localhost:8082/ping')
    })

    it('should GET from the URL supplied as env var', async () => {
      process.env.COURT_CASE_SERVICE_URL = 'http://court_case_service.url'
      await health(reqObj, {}, mockNext)
      expect(axiosSpy).toBeCalledWith('http://court_case_service.url/ping')
    })
  })
})
