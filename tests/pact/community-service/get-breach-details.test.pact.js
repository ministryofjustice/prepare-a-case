/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-breach-details.test.pact.json')
const schema = require('../../../schemas/get-breach-details.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/breaches/{breachId}', () => {
    const crn = 'D991494'
    const convictionId = '1361422142'
    const breachId = '12345'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/breaches/${breachId}`
    const mockData = pactResponseMock.response.jsonBody

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(mockData, schema)
    })

    it('returns the conviction breach details', async () => {
      await provider.addInteraction({
        state: 'will return the specific conviction breach details',
        uponReceiving: 'a request for a specific conviction breach details',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json'
          }
        },
        willRespondWith: {
          status: pactResponseMock.response.status,
          headers: pactResponseMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      validateMocks(process.env.INIT_CWD + '/mappings/community/breach', schema)
    })
  })
})
