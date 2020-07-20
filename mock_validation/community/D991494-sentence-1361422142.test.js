/* global beforeAll, describe, it */
const { getValidator } = require('../utils/validator')
const { testSentenceValidation } = require('./common')

const mapping = require('../../mappings/community/D991494-sentence-1361422142.json')

describe('Validate sentencing mock with CRN D991494 and conviction id 1361422142', () => {
  let validator

  beforeAll(async () => {
    validator = await getValidator()
  })

  it('should validate against the swagger doc', () => {
    testSentenceValidation(validator, mapping)
  })
})
