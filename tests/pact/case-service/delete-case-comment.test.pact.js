/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { createCaseService } = require('../../../server/services/case-service')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('DELETE /cases/{caseId}/comments/{commentId}', () => {
    it('deletes the case comment with given case id and comment id', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case id',
        uponReceiving: 'a request to delete a comment on a case',
        withRequest: {
          method: 'DELETE',
          path: '/cases/f76f1dfe-c41e-4242-b5fa-865d7dd2ce57/comments/1234'
        },
        willRespondWith: {
          status: 200
        }
      })

      const service = createCaseService(provider.mockService.baseUrl)
      const response = await service.deleteCaseComment('f76f1dfe-c41e-4242-b5fa-865d7dd2ce57', 1234)
      expect(response.status).toEqual(200)
    })
  })
})
