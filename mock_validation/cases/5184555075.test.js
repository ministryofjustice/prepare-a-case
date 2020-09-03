/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testGeneralValidation } = require('../common')

const mapping = require('../../mappings/cases/5184555075.json')

describe('Validate court case mock for case 5184555075', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('validate case mock', () => {
    testGeneralValidation(validator, mapping, validator.swagger.definitions.CourtCaseResponse)
  })
})
