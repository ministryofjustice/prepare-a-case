/* global describe, beforeEach, afterEach, it, expect, jest */
const moment = require('moment')
const { defaults, getPath, getMonthsAndDays } = require('../../../routes/middleware/defaults')

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

  describe('getMonthsAndDays method', () => {
    it('should get months and days between two moment dates and return 1 month, 1 day', () => {
      const startDate = moment('2020-01-01', 'YYYY-MM-DD')
      const endDate = moment('2020-02-02', 'YYYY-MM-DD')
      expect(getMonthsAndDays(startDate, endDate)).toEqual('1 month, 1 day')
    })

    it('should get months and days between two moment dates and return 2 months, 2 days', () => {
      const startDate = moment('2020-01-01', 'YYYY-MM-DD')
      const endDate = moment('2020-03-03', 'YYYY-MM-DD')
      expect(getMonthsAndDays(startDate, endDate)).toEqual('2 months, 2 days')
    })
  })

  describe('getPath method', () => {
    it('should return nested object value as string', () => {
      expect(getPath('nested.string')({ nested: { string: 'Some nested string' } })).toEqual('Some nested string')
    })
  })
})
