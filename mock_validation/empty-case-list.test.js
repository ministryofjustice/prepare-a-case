/* global beforeAll, describe, it, expect */
const { getValidator, validate } = require('./utils/validator')

const mapping = require('../mappings/empty-case-list.json')

describe('Validate full case list mock', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    const responseBody = mapping.response.jsonBody
    const definition = validator.swagger.definitions.CaseListResponse
    const isValid = validate(validator, responseBody, definition)
    expect(isValid).toBe(true)
  })
})
