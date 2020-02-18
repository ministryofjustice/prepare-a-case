/* global describe, beforeEach, afterEach, it, expect, jest */
const { apiUrl } = require('../../config/defaults')

describe('Default values middleware', () => {
  const oldEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {}
  })

  afterEach(() => {
    process.env = { ...oldEnv }
  })

  it('should return default values', () => {
    expect(apiUrl).toEqual('http://127.0.0.1:9091')
  })

  it('should change apiUrl and limit if env vars are set', async () => {
    process.env.COURT_CASE_SERVICE_URL = 'some_other_url'
    expect(require('../../config/defaults').apiUrl).toEqual('some_other_url')
  })
})
