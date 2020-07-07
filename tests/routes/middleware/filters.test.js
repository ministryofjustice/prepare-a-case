/* global describe, beforeEach, afterEach, it, expect, jest */
const { filters } = require('../../../server/routes/middleware/filters')

const mockNext = jest.fn()
const reqObj = {
  session: {},
  params: {}
}

describe('Filters middleware', () => {
  beforeEach(() => {
    reqObj.params = {}
    reqObj.session = {}
  })

  afterEach(() => {
    reqObj.params = {}
    reqObj.session = {}
  })

  it('should return default values', async () => {
    await filters(reqObj, {}, mockNext)
    expect(reqObj.params.filters).toEqual(expect.any(Array))
  })

  it('should work with single filters', async () => {
    reqObj.session = {
      selectedFilters: {
        probationStatus: 'Current'
      }
    }
    await filters(reqObj, {}, mockNext)
    expect(reqObj.params.filters).toEqual(expect.any(Array))
    expect(reqObj.params.filters[0].items[0].checked).toBeTruthy()
  })

  it('should work with multiple filters', async () => {
    reqObj.session = {
      selectedFilters: {
        probationStatus: ['Current', 'No record']
      }
    }
    await filters(reqObj, {}, mockNext)
    expect(reqObj.params.filters).toEqual(expect.any(Array))
    expect(reqObj.params.filters[0].items[0].checked).toBeTruthy()
    expect(reqObj.params.filters[0].items[2].checked).toBeTruthy()
  })
})
