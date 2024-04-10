/* global describe, it, expect */
const queryParamBuilder = require('../../server/utils/queryParamBuilder')

describe('utils - queryParamBuilder', () => {
  it('should return a formatted query param string', () => {
    const input = { someParamKey: ['some-param-value-1', 'some-param-value-2'], someOtherParamKey: 'some-other-value' }
    const output = queryParamBuilder(input)

    expect(output).toEqual('someParamKey=some-param-value-1&someParamKey=some-param-value-2&someOtherParamKey=some-other-value')
  })
})
