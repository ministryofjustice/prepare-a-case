/* global describe, beforeEach, afterEach, it, expect, jest */
const { defaults } = require('../../../routes/middleware/defaults')

const reqObj = {
  params: {}
}
const mockNext = jest.fn()
const oldEnv = process.env

describe('Default values middleware', () => {
  beforeEach(() => {
    process.env = {}
  })

  afterEach(() => {
    process.env = { ...oldEnv }
  })

  it('should return default values', async () => {
    await defaults(reqObj, {}, mockNext)
    expect(reqObj.params.limit).toEqual(20)
    expect(reqObj.params.courtCode).toEqual('SHF')
    expect(reqObj.params.courtName).toEqual('Sheffield Magistrates\' Court')
  })

  it('should change apiUrl and limit if env vars are set', async () => {
    process.env.CASES_PER_PAGE = 5

    await defaults(reqObj, {}, mockNext)
    expect(reqObj.params.limit).toEqual(5)
    expect(reqObj.params.courtCode).toEqual('SHF')
    expect(reqObj.params.courtName).toEqual('Sheffield Magistrates\' Court')
  })
})
