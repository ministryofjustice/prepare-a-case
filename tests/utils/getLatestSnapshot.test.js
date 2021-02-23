/* global describe, afterEach, it, expect, jest */
const moment = require('moment')
const config = require('../../config')
const getLatestSnapshot = require('../../server/utils/getLatestSnapshot')

describe('Get latest snapshot', () => {
  const snapshotTimes = config.settings.snapshotTimes.split(',')
  const todayString = moment().format('YYYY-MM-DD')

  describe('latest snapshot for a previous date', () => {
    it('always returns the latest snapshot for the given day', () => {
      expect(getLatestSnapshot('2020-01-01').format('YYYY-MM-DDTHH:mm'))
        .toBe(`2020-01-01T${snapshotTimes[snapshotTimes.length - 1]}`)
    })
  })

  describe('snapshots for the current date', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    snapshotTimes.forEach(snapshotTime => {
      it(`should return the correct snapshot at ${snapshotTime}`, () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
          return new Date(`${todayString}T${snapshotTime}:01.000Z`)
        })

        expect(getLatestSnapshot(todayString).format('YYYY-MM-DDTHH:mm'))
          .toBe(`${todayString}T${snapshotTime}`)
      })
    })
  })
})
