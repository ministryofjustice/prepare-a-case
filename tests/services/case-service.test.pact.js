/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { parseMockResponse } = require('../testUtils/parseMockResponse')

const config = require('../../config')
const apiUrl = config.apis.courtCaseService.url
const courtCode = 'B14LO'

const { getCase } = require('../../server/services/case-service')

const caseMock = require('../../mappings/cases/351196424.json')

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
  describe('Case service - PACT', () => {
    describe('Test getCase', () => {
      const caseNo = '351196424'
      const parsedMockData = parseMockResponse(caseMock.response.jsonBody)

      const caseRequest = {
        uponReceiving: 'a request for a list of cases',
        withRequest: {
          method: 'GET',
          path: `${apiUrl}/court/${courtCode}/case/${caseNo}`,
          headers: {
            Accept: 'application/json'
          }
        }
      }

      const caseResponse = {
        status: caseMock.response.status,
        headers: caseMock.response.headers,
        body: parsedMockData
      }

      beforeEach(() => {
        const interaction = {
          state: 'will return a list of cases',
          ...caseRequest,
          willRespondWith: caseResponse
        }
        return provider.addInteraction(interaction)
      })

      it('returns a successful list of cases', () => {
        return getCase(courtCode, caseNo).then(response => {
          expect(response).toEqual(parsedMockData)
        })
      })
    })
  })
})
