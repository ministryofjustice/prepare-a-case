/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { update } = require('../../../server/services/utils/request')
const { validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./update-case.test.pact.json')
const schema = require('../../../schemas/put-case.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('PUT /court/{courtCode}/case/{caseNo}', () => {
    const mockData = pactResponseMock.response.jsonBody
    const apiUrl = pactResponseMock.request.path

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(mockData, schema)
    })

    it('updates and returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case number',
        uponReceiving: 'a request to update a specific case',
        withRequest: {
          method: pactResponseMock.request.method,
          path: apiUrl,
          headers: pactResponseMock.request.headers,
          body: pactResponseMock.request.jsonBody
        },
        willRespondWith: {
          status: 201,
          headers: pactResponseMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await update(`${provider.mockService.baseUrl}${apiUrl}`, mockData)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
