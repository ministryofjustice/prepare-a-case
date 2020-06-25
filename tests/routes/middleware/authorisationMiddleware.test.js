// eslint-disable-next-line no-unused-vars
/* global describe, beforeEach, afterEach, it, expect, jest, test */
const jwt = require('jsonwebtoken')

const authorisationMiddleware = require('../../../server/routes/middleware/authorisationMiddleware')

const createToken = authorities => {
  const payload = {
    user_name: 'ITAG_USER',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    ...authorities,
    jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
    client_id: 'prepare-a-case-for-court'
  }

  const token = jwt.sign(payload, 'secret', { expiresIn: '1h' })
  return token
}

describe('authorisationMiddleware', () => {
  let req
  const next = jest.fn()

  describe('when there is an authenticated user', () => {
    const createResWithToken = authorities => ({
      locals: {
        user: {
          token: createToken(authorities)
        }
      }
    })

    test('Should have a user', () => {
      const res = createResWithToken({ authorities: ['ROLE_PREPARE_A_CASE'] })

      authorisationMiddleware(req, res, next)

      expect(res.locals.user).toBeDefined()
    })
  })
})
