/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testConvictionsValidation } = require('./common')

const mapping = require('../../mappings/community/D991494-convictions.json')

describe('Validate convictions mock with CRN D991494', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    testConvictionsValidation(validator, mapping)
  })
})
