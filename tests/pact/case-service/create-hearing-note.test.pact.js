/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { createCaseService } = require('../../../server/services/case-service')
const { validateSchema, validateMocks } = require('../../testUtils/schemaValidation')
const requestSchema = require('../../../schemas/post-hearing-note-request.schema.json')
const responseSchema = require('../../../schemas/post-hearing-note-response.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('POST /hearing/{hearingId}/notes', () => {
    const hearingId = '2be36731-6de4-4a47-a0b2-a7a5cb0e15c5'
    const requestBody = {
      hearingId,
      note: 'A note',
      author: 'Adam Sandler'
    }

    it('should validate the JSON request schema against the provided request sample data', () => {
      validateSchema(requestBody, requestSchema)
    })

    it('should validate the WireMock mock responses against the JSON response schema', () => {
      validateMocks(process.env.INIT_CWD + '/mappings/hearing-notes', responseSchema)
    })

    it('Creates hearing note successfully', async () => {
      const addNoteResponse = {
        ...requestBody,
        created: '2022-08-24T15:42:41',
        createdByUuid: 'cc2285f2-91b0-4e00-bd5e-9bdc35896bb6',
        noteId: 12234
      }
      await provider.addInteraction({
        state: 'a hearing exists with the given hearing id',
        uponReceiving: 'a request to create a hearing note',
        withRequest: {
          method: 'POST',
          path: `/hearing/${hearingId}/notes`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: addNoteResponse
        }
      })

      const caseService = createCaseService(provider.mockService.baseUrl)
      const response = await caseService.addHearingNote(hearingId, 'A note', 'Adam Sandler')
      expect(response.status).toEqual(201)
      expect(response.data).toEqual(addNoteResponse)
    })
  })
})
