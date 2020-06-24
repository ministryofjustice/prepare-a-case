/* global expect */
const moment = require('moment')
const { validate } = require('../utils/validator')

function configureResponseBody ($json) {
  $json.response.jsonBody.sessionStartTime = $json.response.jsonBody.sessionStartTime.replace('{{now format=\'yyyy-MM-dd\'}}', moment().format('YYYY-MM-DD'))
  return $json.response.jsonBody
}

function testCourtCaseValidation (validator, courtCase) {
  const responseBody = configureResponseBody(courtCase)
  const definition = validator.swagger.definitions.CourtCaseResponse
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

module.exports = {
  testCourtCaseValidation
}
