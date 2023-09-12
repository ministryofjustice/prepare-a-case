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

  it.each([
    ['2022-08-09T17:17:09.555', '9 August 2022, 17:17'],
    ['2022-8-9T11:17:09', 'Invalid date'],
    [undefined, 'Not available']
  ])('should format JSON datetime %s as %s', (input, expected) => {
    expect(filters.caseCommentTimeFormat(input)).toEqual(expected)
  })

  it.each([
    ['2022-08-09T17:17:09.555', '9 Aug 2022 at 17:17'],
    ['2022-8-9T11:17:09', 'Invalid date'],
    [undefined, 'Not available']
  ])('should format JSON datetime to %s as %s', (input, expected) => {
    expect(filters.hearingOutcomeResultedDateFormat(input)).toEqual(expected)
  })
})
