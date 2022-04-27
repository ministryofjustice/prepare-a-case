/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { createService } = require('../../../server/services/case-service')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('DELETE /defendant/{defendantId}/offender', () => {
    it('deletes the offender associated with a given defendantId ', async () => {
      await provider.addInteraction({
        state: 'an offender exists with the given defendantId',
        uponReceiving: 'a request to delete an offender from a defendant',
        withRequest: {
          method: 'DELETE',
          path: '/defendant/062c670d-fdf6-441f-99e1-d2ce0c3a3846/offender'
        },
        willRespondWith: {
          status: 200
        }
      })

      const service = createService(provider.mockService.baseUrl)
      const response = await service.deleteOffender('062c670d-fdf6-441f-99e1-d2ce0c3a3846')
      expect(response.status).toEqual(200)
    })
  })
})
