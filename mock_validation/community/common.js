/* global expect */
const moment = require('moment')
const { validate } = require('../utils/validator')
const { _ } = require('lodash')

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

  const definition = getDefinition(mapping.request.urlPathPattern, validator.swagger.paths)
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

function isWildcard (actual) {
  const matches = actual.match(/^{.*}$/)
  return matches && matches.length !== 0
}

function pathsMatch (actual, toMatch) {
  return actual === toMatch || isWildcard(toMatch)
}

function matchesPath (path) {
  return (actualPath) => {
    if (_.split(path, '/').length !== _.split(actualPath, '/').length) {
      return false
    }

    return _.every(_.zip(path.split('/'), actualPath.split('/'))
      // [ ["foo", "spam"], ["{bar}", "eggs"], ["{baz}", "ham"]]
      .map((zipped) => pathsMatch(zipped[0], zipped[1])))
  }
}

const getDefinition = (pathToMatch, paths) => {
  const filteredDefinitions = _.filter(Object.keys(paths), matchesPath(pathToMatch))
  console.log(`Matches for ${pathToMatch}: `, filteredDefinitions)
  expect(filteredDefinitions.length).toBe(1)
  return paths[filteredDefinitions[0]]
}

function testBreachValidation (validator, mapping) {
  const responseBody = mapping.response.jsonBody
  const definition = getDefinition(mapping.request.urlPathPattern, validator.swagger.paths)
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

function testRequirementsValidation (validator, mapping) {
  const responseBody = mapping.response.jsonBody
  const definition = getDefinition(mapping.request.urlPathPattern, validator.swagger.paths)
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

function testSentenceValidation (validator, mapping) {
  const responseBody = mapping.response.jsonBody
  const definition = getDefinition(mapping.request.urlPathPattern, validator.swagger.paths)
  const isValid = validate(validator, responseBody, definition)
  expect(isValid).toBe(true)
}

module.exports = {
  testConvictionsValidation,
  testBreachValidation,
  testRequirementsValidation,
  testSentenceValidation
}
