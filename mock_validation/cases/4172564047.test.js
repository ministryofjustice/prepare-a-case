/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testGeneralValidation } = require('../common')

const mapping = require('../../mappings/cases/4172564047.json')

describe('Validate court case mock for case 4172564047', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('validate case mock', () => {
    testGeneralValidation(validator, mapping, validator.swagger.definitions.CourtCaseResponse)
  })
})
