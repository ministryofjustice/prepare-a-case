/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testGeneralValidation } = require('../common')

const mapping = require('../../mappings/matching/3597035492-matches.json')

describe('Validate default requirements mock', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    testGeneralValidation(validator, mapping)
  })
})
