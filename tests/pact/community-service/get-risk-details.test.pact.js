/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-risk-details.test.pact.json')
const schema = require('../../../schemas/get-risk-details.schema.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/registrations', () => {
    const crn = 'D541487'
    const apiUrl = `/offender/${crn}/registrations`
    const mockData = pactResponseMock.response.jsonBody

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(mockData, schema)
    })

    it('returns the defendant risk details', async () => {
      await provider.addInteraction({
        state: 'the defendant has an existing risk assessment',
        uponReceiving: 'a request for defendant risk details',
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
      const mockPath = process.env.INIT_CWD + '/mappings/community/registrations'
      validateMocks(mockPath, schema)
    })
  })
})
