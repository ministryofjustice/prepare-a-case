/* global expect */
const moment = require('moment')
const { validate } = require('../utils/validator')

function testConvictionsValidation (validator, mapping) {
  const responseBody = mapping.response.jsonBody

  if (responseBody.convictions && responseBody.convictions.length) {
    responseBody.convictions.forEach($conviction => {
      if ($conviction.convictionDate) {
        $conviction.convictionDate = $conviction.convictionDate.replace('{{now offset=\'-6 months\' format=\'yyyy-MM-dd\'}}', moment().add(-6, 'months').format('YYYY-MM-DD'))
      }
      if ($conviction.endDate) {
        $conviction.endDate = $conviction.endDate.replace('{{now offset=\'6 months\' format=\'yyyy-MM-dd\'}}', moment().add(6, 'months').format('YYYY-MM-DD'))
        $conviction.endDate = $conviction.endDate.replace('{{now format=\'yyyy-MM-dd\'}}', moment().format('YYYY-MM-DD'))
      }
      if ($conviction.sentence && $conviction.sentence.terminationDate) {
        $conviction.sentence.terminationDate = $conviction.sentence.terminationDate.replace('{{now offset=\'5 months\' format=\'yyyy-MM-dd\'}}', moment().add(5, 'months').format('YYYY-MM-DD'))
      }
      if ($conviction.documents && $conviction.documents.length) {
        $conviction.documents.forEach($document => {
          $document.reportDocumentDates.completedDate = $document.reportDocumentDates.completedDate.replace('{{now offset=\'-1 months\' format=\'yyyy-MM-dd\'}}', moment().add(-1, 'months').format('YYYY-MM-DD'))
          $document.reportDocumentDates.completedDate = $document.reportDocumentDates.completedDate.replace('{{now offset=\'-5 days\' format=\'yyyy-MM-dd\'}}', moment().add(-5, 'days').format('YYYY-MM-DD'))
        })
      }
    })
  }

  const definition = validator.swagger.definitions['Probation Record']
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

function testBreachValidation (validator, mapping) {
  const responseBody = mapping.response.jsonBody
  const definition = validator.swagger.definitions.BreachResponse
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

function testRequirementsValidation (validator, mapping) {
  const responseBody = mapping.response.jsonBody
  const definition = validator.swagger.definitions['Lists of Requirements']
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

function testSentenceValidation (validator, mapping) {
  const responseBody = mapping.response.jsonBody
  const definition = validator.swagger.definitions.SentenceResponse
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

module.exports = {
  testConvictionsValidation,
  testBreachValidation,
  testRequirementsValidation,
  testSentenceValidation
}
