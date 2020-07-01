/* global beforeAll, describe, it, expect */
const moment = require('moment')
const { getValidator, validate } = require('./utils/validator')

const mapping = require('../mappings/case-list-full.json')

describe('Validate full case list mock', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    const responseBody = mapping.response.jsonBody
    const definition = validator.swagger.definitions.CaseListResponse

    responseBody.cases.forEach($case => {
      $case.sessionStartTime = $case.sessionStartTime.replace('{{now format=\'yyyy-MM-dd\'}}', moment().format('YYYY-MM-DD'))
    })

    const isValid = validate(validator, responseBody, definition)
    expect(isValid).toBe(true)
  })
})
