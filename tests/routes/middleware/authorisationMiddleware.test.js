/* global describe, expect, jest, test */
const jwt = require('jsonwebtoken')
const { authorisationMiddleware } = require('../../../server/routes/middleware/authorisationMiddleware')

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
  const signInService = { getRefreshedToken: jest.fn() }
  const middleware = authorisationMiddleware(signInService)

  describe('when there is an authenticated user', () => {
    const createResWithToken = authorities => ({
      locals: {
        user: {
          token: createToken(authorities)
        }
      },
      redirect: jest.fn()
    })

    test('Should have a user', async () => {
      const res = createResWithToken({ authorities: ['ROLE_PREPARE_A_CASE'] })

      await middleware(req, res, next)

      expect(res.locals.user).toBeDefined()
    })
  })

  describe('when the user token is due for refresh', () => {
    const createResWithToken = (authorities, refreshTime) => ({
      locals: {
        user: {
          token: createToken(authorities),
          refreshTime
        }
      },
      redirect: jest.fn()
    })

    test('Should refresh the token before continuing', async () => {
      const refreshedToken = createToken({ authorities: ['ROLE_PREPARE_A_CASE'] })
      signInService.getRefreshedToken.mockResolvedValueOnce({
        token: refreshedToken,
        refreshToken: 'new-refresh-token',
        refreshTime: Date.now() + 1000 * 60 * 60
      })
      const res = createResWithToken({ authorities: ['ROLE_PREPARE_A_CASE'] }, Date.now() - 1000)

      await middleware(req, res, next)

      expect(signInService.getRefreshedToken).toHaveBeenCalledWith(res.locals.user)
      expect(res.locals.user.token).toEqual(refreshedToken)
      expect(next).toHaveBeenCalled()
    })

    test('Should redirect to login when the refresh fails', async () => {
      signInService.getRefreshedToken.mockRejectedValueOnce(new Error('refresh failed'))
      req = { session: {} }
      const res = createResWithToken({ authorities: ['ROLE_PREPARE_A_CASE'] }, Date.now() - 1000)

      await middleware(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/login')
    })
  })
})
