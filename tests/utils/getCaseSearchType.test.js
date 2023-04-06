/* global describe it expect */
const getCaseSearchType = require('../../server/utils/getCaseSearchType')
describe('getCaseSearchType', () => {
  it.each([
    ['C123456', 'CRN'],
    ['C12345', 'NAME'],
    ['C12345D', 'NAME'],
    ['CAD3456', 'NAME'],
    ['Jeff Bloggs', 'NAME'],
    ['Bloggs', 'NAME'],
    [undefined, undefined],
    ['', undefined]
  ])('given search term %s should return case search type %s', (input, expected) => {
    expect(getCaseSearchType(input)).toEqual(expected)
  })
})
