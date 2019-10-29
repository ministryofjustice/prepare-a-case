const axios = require('axios')
const { health } = require('../../../routes/middleware/healthcheck')

const mockNext = jest.fn()
const resolveObj = { status: 200 }
const reqObj = { healthy: false }

describe('Health check middleware', () => {

  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(url => {
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

})
