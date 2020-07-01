/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testCourtCaseValidation } = require('./common')

const mapping = require('../../mappings/cases/7483843110.json')

describe('Validate court case mock for case 7483843110', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('validate case mock', () => {
    testCourtCaseValidation(validator, mapping)
  })
})
