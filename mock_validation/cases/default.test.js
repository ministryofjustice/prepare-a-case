/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testCourtCaseValidation } = require('./common')

const mapping = require('../../mappings/cases/default.json')

describe('Validate court case mock for the default case', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('validate case mock', () => {
    testCourtCaseValidation(validator, mapping)
  })
})
