/* global describe, it, expect, jest */
const moment = require('moment')
const { defaults, getPath, getMonthsAndDays, addBusinessDays } = require('../../../server/routes/middleware/defaults')

const reqObj = {
  params: {}
}
const mockNext = jest.fn()

describe('Default values middleware', () => {
  it('should return default values', async () => {
    await defaults(reqObj, {}, mockNext)
    expect(reqObj.params.limit).toEqual(20)
    expect(reqObj.params.courtCode).toEqual(undefined)
    expect(reqObj.params.courtName).toEqual('')
    expect(reqObj.params.courtRooms).toEqual(0)
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

  describe('addBusinessDays method', () => {
    it('should add days to the given date', () => {
      const startDate = moment('2020-01-01', 'YYYY-MM-DD')
      const endDate = moment('2020-01-02', 'YYYY-MM-DD')
      expect(addBusinessDays(startDate, 1).format('YYYY-MM-DD')).toEqual(endDate.format('YYYY-MM-DD'))
    })

    it('should minus days from the given date', () => {
      const startDate = moment('2020-01-02', 'YYYY-MM-DD')
      const endDate = moment('2020-01-01', 'YYYY-MM-DD')
      expect(addBusinessDays(startDate, -1).format('YYYY-MM-DD')).toEqual(endDate.format('YYYY-MM-DD'))
    })

    it('should skip weekend days from the calculation when adding days', () => {
      const startDate = moment('2020-07-10', 'YYYY-MM-DD') // Friday
      const endDate = moment('2020-07-13', 'YYYY-MM-DD') // Monday
      expect(addBusinessDays(startDate, 1).format('YYYY-MM-DD')).toEqual(endDate.format('YYYY-MM-DD'))
    })

    it('should skip weekend days from the calculation when removing days', () => {
      const startDate = moment('2020-07-13', 'YYYY-MM-DD') // Monday
      const endDate = moment('2020-07-10', 'YYYY-MM-DD') // Friday
      expect(addBusinessDays(startDate, -1).format('YYYY-MM-DD')).toEqual(endDate.format('YYYY-MM-DD'))
    })
  })

  describe('getPath method', () => {
    it('should return nested object value as string', () => {
      expect(getPath('nested.string')({ nested: { string: 'Some nested string' } })).toEqual('Some nested string')
    })
  })
})
