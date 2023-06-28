/* global describe it expect */
const getCaseSearchType = require('../../server/utils/getCaseSearchType')
describe('getCaseSearchType', () => {
  it.each([
    ['C123456', 'CRN'],
    ['Jeff Bloggs', 'NAME'],
    ['Bloggs', 'NAME'],
    [undefined, undefined],
    ['', undefined]
  ])('given search term %s should return case search type %s', (input, expected) => {
    expect(getCaseSearchType(input).searchType).toEqual(expected)
  })

  const CRN_ERROR = 'Enter a CRN in the format one letter followed by 6 numbers, for example A123456.'
  const MISSING_CRN_ERROR = 'You must enter a CRN or a person’s name.'
  const ERROR_ONLY_ALPHANUMERIC = 'CRNs and names can only contain numbers 0 to 9 and letters A to Z.'
  it.each([
    ['C12345', CRN_ERROR],
    ['C12345D', CRN_ERROR],
    ['CAD3456', CRN_ERROR],
    ['Joe blogs1', CRN_ERROR],
    [undefined, MISSING_CRN_ERROR],
    ['', MISSING_CRN_ERROR],
    ['a'.repeat(651), 'Name must be less than 650 characters'],
    ['a'.repeat(650), undefined],
    ['o’hara', ERROR_ONLY_ALPHANUMERIC],
    ['name & name', ERROR_ONLY_ALPHANUMERIC]
  ])('given search term %s should return error for invalid input', (input, expectedError) => {
    expect(getCaseSearchType(input).error).toEqual(expectedError)
  })
})
