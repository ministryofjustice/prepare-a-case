/* global describe, it, expect, jest */
const filters = require('../../server/utils/nunjucksFilters.js')

describe('nunjucksFilters', () => {
  it('should render courtRoomDisplay values as expected', () => {
    const values = [
      { input: '1', expected: '1' },
      { input: 'Courtroom 1', expected: '1' },
      { input: '05', expected: '5' },
      { input: 'Courtroom 05', expected: '5' }
    ]

    values.forEach(value => {
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

    values.forEach(value => {
      expect(filters.ordinalNumber(value.input)).toEqual(value.expected)
    })
  })

  describe('properCase', () => {
    it('should return blank string if no name supplied', () => {
      expect(filters.properCase(undefined)).toEqual('')
    })

    it.each([
      ['VAN', 'van'],
      ['DE', 'de'],
      ['DER', 'der'],
      ['DA', 'da'],
      ['VON', 'von']
    ])('should correctly capitalise nobilary particles', (input, expected) => {
      const testName = `Test ${input} Name`
      expect(filters.properCase(testName)).toEqual(`Test ${expected} Name`)
    })

    it('should correctly capitalise Gaelic surnames', () => {
      const testName = 'test mcname'
      expect(filters.properCase(testName)).toEqual('Test McName')
    })
  })

  describe('removeTitle', () => {
    it('should return blank string if no name supplied', () => {
      expect(filters.removeTitle(undefined)).toEqual('')
    })

    it.each(['Mr', 'Miss', 'Mrs', 'Ms', 'Dr', '01'])(
      'Should remove the title from the name',
      input => {
        const testName = `${input} Test Name`
        expect(filters.removeTitle(testName)).toEqual('Test Name')
      }
    )
  })

  describe('markMatches', () => {
    it('should return correctly formatted string of all matches', () => {
      const sourceString = 'one, two, three'
      const matchString = 'one, two, three'

      const markedMatches = filters.markMatches(matchString, sourceString)

      expect(markedMatches).toEqual(
        '<mark>one</mark>, <mark>two</mark>, <mark>three</mark>'
      )
    })

    it('should return correctly formatted string of partial matches', () => {
      const sourceString = 'one, two, three'
      const matchString = 'one, three, four'

      const markedMatches = filters.markMatches(matchString, sourceString)

      expect(markedMatches).toEqual(
        '<mark>one</mark>, <mark>three</mark>, four'
      )
    })
  })

  describe('emptyIfUnmarked', () => {
    it('returns empty string if not marked', () => {
      const matchString = 'unmarked'

      const emptyIfUnmarked = filters.emptyIfUnmarked(matchString)

      expect(emptyIfUnmarked).toEqual('')
    })

    it('returns input string if marked', () => {
      const matchString = '<mark>marked</mark>'

      const emptyIfUnmarked = filters.emptyIfUnmarked(matchString)

      expect(emptyIfUnmarked).toEqual('<mark>marked</mark>')
    })
  })

  describe('apostropheInName', () => {
    it('replaces html apostrophe', () => {
      const name = 'O&#39;Lastname'

      const apostropheInName = filters.apostropheInName(name)

      expect(apostropheInName).toEqual("O'Lastname")
    })
  })

  describe('unique', () => {
    it('creates a unique copy of an array', () => {
      const array = [1, 2, 2, 3]

      const unique = filters.unique(array)

      expect(unique).toEqual([1, 2, 3])
    })
  })

  describe('courtRoomDisplay', () => {
    it('removes Courtroom substring from input string', () => {
      const sourceString = 'Courtroom 024'

      const courtRoomDisplay = filters.courtRoomDisplay(sourceString)

      expect(courtRoomDisplay).toEqual('24')
    })

    it('removes leading zeroes', () => {
      const sourceString = '024'

      const courtRoomDisplay = filters.courtRoomDisplay(sourceString)

      expect(courtRoomDisplay).toEqual('24')
    })
  })

  describe('ordinalNumber', () => {
    it('returns Not Available if input is not a number', () => {
      const input = 'not a number'

      const ordinalNumber = filters.ordinalNumber(input)

      expect(ordinalNumber).toEqual('Not available')
    })

    it("returns 'st' ordinal suffix'", () => {
      const input = 1

      const ordinalNumber = filters.ordinalNumber(input)

      expect(ordinalNumber).toEqual('1st')
    })

    it("returns 'nd' ordinal suffix'", () => {
      const input = 2

      const ordinalNumber = filters.ordinalNumber(input)

      expect(ordinalNumber).toEqual('2nd')
    })

    it("returns 'rd' ordinal suffix'", () => {
      const input = 3

      const ordinalNumber = filters.ordinalNumber(input)

      expect(ordinalNumber).toEqual('3rd')
    })

    it("returns 'th' ordinal suffix'", () => {
      const input = 4

      const ordinalNumber = filters.ordinalNumber(input)

      expect(ordinalNumber).toEqual('4th')
    })
  })

  describe('caseCommentTimeFormat', () => {
    it.each([
      ['2022-08-09T17:17:09.555', '9 August 2022, 17:17'],
      ['2022-8-9T11:17:09', 'Invalid date'],
      [undefined, 'Not available']
    ])('should format JSON datetime %s as %s', (input, expected) => {
      expect(filters.caseCommentTimeFormat(input)).toEqual(expected)
    })
  })

  describe('hearingOutcomeResultedDateFormat', () => {
    it.each([
      ['2022-08-09T17:17:09.555', '9 Aug 2022 at 17:17'],
      ['2022-8-9T11:17:09', 'Invalid date'],
      [undefined, 'Not available']
    ])('should format JSON datetime to %s as %s', (input, expected) => {
      expect(filters.hearingOutcomeResultedDateFormat(input)).toEqual(expected)
    })
  })

  describe('doubleQuote', () => {
    it('returns double quoted string in html format', () => {
      const input = 'some string'

      const doubleQuote = filters.doubleQuote(input)

      expect(doubleQuote).toEqual('&ldquo;some string&rdquo;')
    })

    it('returns empty string if input not supplied', () => {
      const input = undefined

      const doubleQuote = filters.doubleQuote(input)

      expect(doubleQuote).toEqual('&ldquo;&rdquo;')
    })
  })

  describe('caseSearchDateFormat', () => {
    it('returns empty string if input not supplied', () => {
      const input = undefined

      const caseSearchDateFormat = filters.caseSearchDateFormat(input)

      expect(caseSearchDateFormat).toEqual('')
    })

    it('returns formatted string', () => {
      const input = '01/01/1970'

      const caseSearchDateFormat = filters.caseSearchDateFormat(input)

      expect(caseSearchDateFormat).toEqual('1 January 1970')
    })
  })

  describe('hearingNoteTimeFormat', () => {
    it("returns 'Not available' if input not supplied", () => {
      const input = undefined

      const hearingNoteTimeFormat = filters.hearingNoteTimeFormat(input)

      expect(hearingNoteTimeFormat).toEqual('Not available')
    })

    it('returns formatted string', () => {
      const input = '01/01/1970'

      const hearingNoteTimeFormat = filters.hearingNoteTimeFormat(input)

      expect(hearingNoteTimeFormat).toEqual('Thursday 1 January 1970')
    })
  })

  describe('json', () => {
    it('returns blank string if no input supplied', () => {
      const input = undefined

      const json = filters.json(input)

      expect(json).toEqual('')
    })

    it('returns parsed json', () => {
      const input = {}
      JSON.parse = jest.fn().mockImplementationOnce(() => {
        return 'some-parsed-json'
      })

      const json = filters.json(input)

      expect(json).toEqual('some-parsed-json')
    })
  })

  describe('limit', () => {
    it('returns empty array if no input supplied', () => {
      const input = undefined
      const inputLimit = 1

      const limit = filters.limit(input, inputLimit)

      expect(limit).toEqual([])
    })

    it('returns sliced subarray', () => {
      const input = [1, 2, 3]
      const inputLimit = 2

      const limit = filters.limit(input, inputLimit)

      expect(limit).toEqual([1, 2])
    })
  })
})
