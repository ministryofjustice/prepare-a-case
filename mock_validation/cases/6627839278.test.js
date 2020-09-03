/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testGeneralValidation } = require('../common')

const mapping = require('../../mappings/cases/6627839278.json')

describe('Validate court case mock for case 6627839278', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('validate case mock', () => {
    testGeneralValidation(validator, mapping, validator.swagger.definitions.CourtCaseResponse)
  })
})
