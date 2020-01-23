/* global describe, beforeEach, afterEach, it, expect, jest */
const { defaults } = require('../../../routes/middleware/defaults')

const reqObj = {
  params: {}
}
const mockNext = jest.fn()
const oldEnv = process.env

describe('Default values middleware', () => {
  beforeEach(() => {
    process.env = { ...oldEnv }
  })

  afterEach(() => {
    process.env = { ...oldEnv }
  })

  it('should return default values', async () => {
    await defaults(reqObj, {}, mockNext)
    expect(reqObj.params.courtCode).toEqual('SHF')
    expect(reqObj.params.courtName).toEqual('Sheffield Magistrates\' Court')
    expect(reqObj.params.apiUrl).toEqual('http://127.0.0.1:9091')
  })

  it('should change apiUrl if env var is set', async () => {
    process.env.COURT_CASE_SERVICE_URL = 'http://court_case_service.url'

    await defaults(reqObj, {}, mockNext)
    expect(reqObj.params.courtCode).toEqual('SHF')
    expect(reqObj.params.courtName).toEqual('Sheffield Magistrates\' Court')
    expect(reqObj.params.apiUrl).toEqual('http://court_case_service.url')
  })
})
