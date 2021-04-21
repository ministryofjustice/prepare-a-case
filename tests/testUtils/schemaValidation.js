/* global expect */
const fs = require('fs')
const path = require('path')
const Ajv = require('ajv').default

const { parseMockResponse } = require('./parseMockResponse')

function validateMocks (mockFilesPath, schema) {
  fs.readdir(path.join(mockFilesPath), (err, filenames) => {
    if (err) {
      return
    }
    filenames.forEach(filename => {
      const wireMockFile = require(path.join(`${mockFilesPath}/${filename}`))
      const parsedMock = parseMockResponse(wireMockFile.response.jsonBody)
      const ajv = new Ajv({ allErrors: true })
      require('ajv-errors')(ajv)

      const validateSchema = ajv.compile(schema)
      const isValidated = validateSchema(parsedMock)
      if (!isValidated) {
        console.log('ERROR IN MOCK:', path.join(`${mockFilesPath}/${filename}`), '\n', validateSchema.errors)
      }
      expect(isValidated).toBeTruthy()
    })
  })
}

function validateSchema (mockData, schema) {
  const ajv = new Ajv()
  const validateSchema = ajv.compile(schema)
  const isValidated = validateSchema(mockData)
  if (!isValidated) {
    console.log('ERROR IN MOCK DATA:', schema.title, '\n', validateSchema.errors)
  }
  expect(isValidated).toBeTruthy()
}

module.exports = {
  validateMocks,
  validateSchema
}
