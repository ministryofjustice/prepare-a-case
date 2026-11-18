/* global describe it expect */
const getCaseSearchType = require('../../server/utils/getCaseSearchType')
describe('getCaseSearchType', () => {
  it.each([
    ['C123456', 'CRN'],
    ['1234/1234567A', 'PNC'],
    ['99AA9999999', 'URN'],
    ['99A99999999', 'URN'],
    ['AAA9999999', 'URN'],
    ['99999999AA99AAA', 'URN'],
    ['99AA9999999999999999AA', 'URN'],
    ['Jeff Bloggs', 'NAME'],
    ['Bloggs', 'NAME'],
    [undefined, undefined],
    ['', undefined]
  ])('given search term %s should return case search type %s', (input, expected) => {
    expect(getCaseSearchType(input).searchType).toEqual(expected)
  })

  const MISSING_SEARCH_TERM_ERROR = 'You must enter a URN, CRN, PNC ID or defendant\'s name'
  const ERROR_ONLY_VALID_CHARS = 'Remove any special characters apart from hyphens (-), apostrophes (\') and forward slashes (/)'
  it.each([
    [undefined, MISSING_SEARCH_TERM_ERROR],
    ['', MISSING_SEARCH_TERM_ERROR],
    ['a'.repeat(651), 'Name must be less than 650 characters'],
    ['a'.repeat(650), undefined],
    ['o’hara', ERROR_ONLY_VALID_CHARS],
    ['o\'hara', undefined],
    ['o-hara', undefined],
    ['name & name', ERROR_ONLY_VALID_CHARS]
  ])('given search term %s should return error for invalid input', (input, expectedError) => {
    expect(getCaseSearchType(input).error).toEqual(expectedError)
  })
})
