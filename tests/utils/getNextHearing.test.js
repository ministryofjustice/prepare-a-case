/* global describe, it, expect */
const moment = require('moment')
const getNextHearing = require('../../server/utils/getNextHearing')

describe('getNextHearing', () => {
  describe('for COMMON_PLATFORM cases', () => {
    it('should get next closest hearing when there are no hearings today', () => {
      const currentDateTime = moment('2022-09-09T12:00:00')
      const expectedNextHearing = moment('2022-09-15T11:00:00')
      const hearingList = [
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-7' },
        { hearingDateTime: '2022-09-15T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-07-25T11:00:00', hearingId: 'hearing-id-8' },
        { hearingDateTime: '2022-08-30T11:00:00', hearingId: 'hearing-id-9' }
      ]
      const actual = getNextHearing(hearingList, currentDateTime, 'COMMON_PLATFORM')
      expect(moment(actual.hearingDateTime)).toEqual(expectedNextHearing)
      expect(actual.hearingId).toEqual('hearing-id-5')
    })

    it('should get next closest hearing as the one which is in the MORNING session for the whole morning session', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T11:00:00', hearingId: 'hearing-id-7' }, // current day morning session but before the current time
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T14:00:00', hearingId: 'hearing-id-8' } // current day afternoon session
      ]
      const currentDateTime = moment('2022-09-15T11:30:00') // current time is past the hearing time of the hearing in morning session

      const actual = getNextHearing(hearingList, currentDateTime, 'COMMON_PLATFORM')
      expect(actual.hearingDateTime).toEqual('2022-09-15T11:00:00')
      expect(actual.hearingId).toEqual('hearing-id-7')
    })

    it('should get next closest hearing as the one which is in the AFTERNOON session for the whole morning session', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T11:00:00', hearingId: 'hearing-id-7' }, // current day before morning session end
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T13:01:00', hearingId: 'hearing-id-8' } // current day afternoon session and after current time
      ]
      const currentDateTime = moment('2022-09-15T13:00:01') // current time is past the morning session

      const actual = getNextHearing(hearingList, currentDateTime, 'COMMON_PLATFORM')
      expect(actual.hearingDateTime).toEqual('2022-09-15T13:01:00')
      expect(actual.hearingId).toEqual('hearing-id-8')
    })

    it('should get next closest hearing from the next and not today\'s when the current date time is past court sessions for the day (17:00)', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T11:00:00', hearingId: 'hearing-id-7' }, // current day before morning session end
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T13:01:00', hearingId: 'hearing-id-8' }, // current day afternoon session and after current time
        { hearingDateTime: '2022-09-16T11:01:00', hearingId: 'hearing-id-11' } // Next day morning session
      ]
      const currentDateTime = moment('2022-09-15T17:01:00') // current time is past the evening court session (17:00hrs)

      const actual = getNextHearing(hearingList, currentDateTime, 'COMMON_PLATFORM')
      expect(actual.hearingDateTime).toEqual('2022-09-16T11:01:00')
      expect(actual.hearingId).toEqual('hearing-id-11')
    })

    it('should get next closest hearing from today\'s when the current date time is before court sessions start for the day (before 10:00)', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T11:00:00', hearingId: 'hearing-id-7' }, // current day before morning session end
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T13:01:00', hearingId: 'hearing-id-8' }, // current day afternoon session and after current time
        { hearingDateTime: '2022-09-16T11:01:00', hearingId: 'hearing-id-11' } // Next day morning session
      ]
      const currentDateTime = moment('2022-09-15T08:00:00') // current time is past the evening court session (17:00hrs)

      const actual = getNextHearing(hearingList, currentDateTime, 'COMMON_PLATFORM')
      expect(actual.hearingDateTime).toEqual('2022-09-15T11:00:00')
      expect(actual.hearingId).toEqual('hearing-id-7')
    })

    it('should not return a hearing if there are no upcoming hearings', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-07-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-05-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-10T10:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T12:00:00', hearingId: 'hearing-id-8' } // current day morning session
      ]
      const currentDateTime = moment('2022-09-15T13:00:01') // current time is past the morning session

      const actual = getNextHearing(hearingList, currentDateTime, 'COMMON_PLATFORM')
      expect(actual).toBeUndefined()
    })
  })

  describe('for LIBRA cases', () => {
    it.each(
      [
        moment('2022-09-15T09:30:00'),
        moment('2022-09-15T10:30:00'),
        moment('2022-09-15T12:30:00'),
        moment('2022-09-15T13:05:30'),
        moment('2022-09-15T14:30:00'),
        moment('2022-09-15T17:00:00')
      ]
    )('given current time is %s should get next closest hearing as the one which is in the MORNING session, on the current day, for the whole day', (currentDateTime) => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T10:30:00', hearingId: 'hearing-id-7' }, // current day morning session
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T14:00:00', hearingId: 'hearing-id-8' } // current day afternoon session
      ]

      const actual = getNextHearing(hearingList, currentDateTime, 'LIBRA')
      expect(actual.hearingDateTime).toEqual('2022-09-15T10:30:00')
      expect(actual.hearingId).toEqual('hearing-id-7')
    })

    it('should get next closest hearing given there are no hearings on the current day', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-28T10:30:00', hearingId: 'hearing-id-7' },
        { hearingDateTime: '2022-09-26T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-22T14:00:00', hearingId: 'hearing-id-8' }
      ]
      const currentDateTime = moment('2022-09-15T09:30:00')
      const actual = getNextHearing(hearingList, currentDateTime, 'LIBRA')
      expect(actual.hearingDateTime).toEqual('2022-09-22T14:00:00')
      expect(actual.hearingId).toEqual('hearing-id-8')
    })

    it('should get next closest hearing from today\'s when the current date time is before court sessions start for the day (before 10:00)', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T11:00:00', hearingId: 'hearing-id-7' }, // current day before morning session end
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T13:01:00', hearingId: 'hearing-id-8' }, // current day afternoon session and after current time
        { hearingDateTime: '2022-09-16T11:01:00', hearingId: 'hearing-id-11' } // Next day morning session
      ]
      const currentDateTime = moment('2022-09-15T08:00:00') // current time is past the evening court session (17:00hrs)

      const actual = getNextHearing(hearingList, currentDateTime, 'LIBRA')
      expect(actual.hearingDateTime).toEqual('2022-09-15T11:00:00')
      expect(actual.hearingId).toEqual('hearing-id-7')
    })

    it('should get next closest hearing from the next and not today\'s when the current date time is past court sessions for the day (17:00)', () => {
      const hearingList = [
        { hearingDateTime: '2022-09-08T16:00:00', hearingId: 'hearing-id-4' },
        { hearingDateTime: '2022-10-10T11:00:00', hearingId: 'hearing-id-2' },
        { hearingDateTime: '2022-11-30T11:00:00', hearingId: 'hearing-id-5' },
        { hearingDateTime: '2022-09-15T11:00:00', hearingId: 'hearing-id-7' },
        { hearingDateTime: '2022-09-15T15:00:00', hearingId: 'hearing-id-6' },
        { hearingDateTime: '2022-09-15T13:01:00', hearingId: 'hearing-id-8' },
        { hearingDateTime: '2022-09-16T11:01:00', hearingId: 'hearing-id-11' } // Next day morning session
      ]
      const currentDateTime = moment('2022-09-15T17:01:00') // current time is past the evening court session (17:00hrs)

      const actual = getNextHearing(hearingList, currentDateTime, 'LIBRA')
      expect(actual.hearingDateTime).toEqual('2022-09-16T11:01:00')
      expect(actual.hearingId).toEqual('hearing-id-11')
    })
  })
})
