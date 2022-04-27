/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { createCaseService } = require('../../../server/services/case-service')
const { validateSchema, validateMocks } = require('../../testUtils/schemaValidation')
const schema = require('../../../schemas/put-defendant-offender.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('PUT /defendant/{defendantId}/offender', () => {
    const requestResponseBody = {
      probationStatus: 'CURRENT',
      crn: 'X320741',
      pnc: 'PNC',
      cro: 'CRO',
      previouslyKnownTerminationDate: '2010-01-01',
      suspendedSentenceOrder: true,
      breach: true,
      preSentenceActivity: true,
      awaitingPsr: true
    }

    it('should validate the JSON schema against the provided request sample data', () => {
      validateSchema(requestResponseBody, schema)
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      validateMocks(process.env.INIT_CWD + '/mappings/matching/confirm', schema)
    })

    it('updates the offender associated with a given defendantId ', async () => {
      await provider.addInteraction({
        state: 'an offender exists with the given defendantId',
        uponReceiving: 'a request to update the offender on a defendant',
        withRequest: {
          method: 'PUT',
          path: '/defendant/062c670d-fdf6-441f-99e1-d2ce0c3a3846/offender',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestResponseBody
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestResponseBody
        }
      })

      const caseService = createCaseService(provider.mockService.baseUrl)
      const response = await caseService.updateOffender('062c670d-fdf6-441f-99e1-d2ce0c3a3846', requestResponseBody)
      expect(response.status).toEqual(200)
      expect(response.data).toEqual(requestResponseBody)
    })
  })
})
