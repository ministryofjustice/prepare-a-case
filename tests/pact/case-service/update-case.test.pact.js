/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { update } = require('../../../server/services/utils/request')
const { validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./update-case.test.pact.json')
const schema = require('../../../schemas/put-case.schema.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('PUT /court/{courtCode}/case/{caseNo}', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}`
    const mockData = pactResponseMock.response.jsonBody

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(mockData, schema)
    })

    it('updates and returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case number',
        uponReceiving: 'a request to update a specific case',
        withRequest: {
          method: 'PUT',
          path: apiUrl,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Accept: 'application/json'
          },
          body: mockData
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
