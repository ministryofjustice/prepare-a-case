/* global expect */
const fs = require('fs')
const path = require('path')
const Ajv = require('ajv').default

const { parseMockResponse } = require('./parseMockResponse')

function validateMocks (mockFilesPath, schema) {
  fs.readdir(path.join(mockFilesPath), (err, filenames) => {
    filenames.forEach(filename => {
      const wireMockFile = require(path.join(`${mockFilesPath}/${filename}`))
      const parsedMock = parseMockResponse(wireMockFile.response.jsonBody)
      const ajv = new Ajv({ allErrors: true })
      require('ajv-errors')(ajv)
      const validateSchema = ajv.compile(schema)
      if (validateSchema.errors) {
        console.info(validateSchema.errors)
      }
      expect(validateSchema(parsedMock)).toBeTruthy()
    })
  })
}

function validateSchema (mockData, schema) {
  const ajv = new Ajv()
  const validateSchema = ajv.compile(schema)
  expect(validateSchema(mockData)).toBeTruthy()
}

module.exports = {
  validateMocks,
  validateSchema
}
