/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testRequirementsValidation } = require('./common')

const mapping = require('../../mappings/community/DX12340A-requirements-2360414697.json')

describe('Validate requirements mock with CRN DX12340A and conviction id 2360414697', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    testRequirementsValidation(validator, mapping)
  })
})
