/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testBreachValidation } = require('./common')

const mapping = require('../../mappings/community/D991494-breach-98765.json')

describe('Validate breach mock with CRN D991494 and breach id 98765', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    testBreachValidation(validator, mapping)
  })
})
