/* global describe, it, expect */
const filters = require('../../server/utils/nunjucksFilters.js')

describe('nunjucksFilters', () => {
  it('should render courtRoomDisplay values as expected', () => {
    const values = [
      { input: '1', expected: '1' },
      { input: 'Courtroom 1', expected: '1' },
      { input: '05', expected: '5' },
      { input: 'Courtroom 05', expected: '5' }
    ]

    values.forEach((value) => {
      expect(filters.courtRoomDisplay(value.input)).toEqual(value.expected)
    })
  })

  it('should render ordinal numbers as expected', () => {
    const values = [
      { input: 1, expected: '1st' },
      { input: 2, expected: '2nd' },
      { input: 3, expected: '3rd' },
      { input: 4, expected: '4th' },
      { input: 5, expected: '5th' },
      { input: 6, expected: '6th' },
      { input: 7, expected: '7th' },
      { input: 8, expected: '8th' },
      { input: 9, expected: '9th' },
      { input: 10, expected: '10th' },
      { input: 10000000, expected: '10000000th' },
      { input: '1', expected: 'Not available' },
      { input: 'nopenopenope', expected: 'Not available' },
      { input: null, expected: 'Not available' },
      { input: undefined, expected: 'Not available' }
    ]

    values.forEach((value) => {
      expect(filters.ordinalNumber(value.input)).toEqual(value.expected)
    })
  })
})
