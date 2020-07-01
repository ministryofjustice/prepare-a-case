/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testRequirementsValidation } = require('./common')

const mapping = require('../../mappings/community/default-requirements.json')

describe('Validate default requirements mock', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    testRequirementsValidation(validator, mapping)
  })
})
