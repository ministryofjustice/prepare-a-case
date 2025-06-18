import jwt from 'jsonwebtoken'
const superagent = require('superagent')

const url = 'http://localhost:9091/__admin'

const signOut = () =>
  superagent.post(`${url}/mappings`)
    .send({
      request: {
        method: 'GET',
        urlPattern: '/auth/logout.*'
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        },
        body: '<html><body>Login page<h1>Sign in</h1></body></html>'
      }
    })

async function stubOauthAuthorise() {
  return superagent.post(`${url}/mappings`)
    .send({
      request: {
        method: 'GET',
        urlPath: '/auth/oauth/authorize'
      },
      response: {
        status: 302,
        headers: {
          'Content-Type': 'text/html',
          Location: 'http://localhost:3000/login/callback?code=asdfasdfasdf'
        },
        body: '<html><body>Login page<h1>Sign in</h1></body></html>'
      }
    })
}

const tokenStub = () =>
  superagent.post(`${url}/mappings`).send({
    request: {
      method: 'POST',
      urlPath: '/auth/oauth/token'
    },
    response: {
      status: 200,
      jsonBody: {
        access_token: createToken({ roles: ['PREPARE_A_CASE'] }),
        refresh_token: 'nothing',
        token_type: 'bearer',
        user_name: 'USER1',
        expires_in: 599,
        scope: 'read',
        internalUser: true
      }
    }
  })

const createToken = (userToken) => {
  // authorities in the session are always prefixed by ROLE.
  const authorities = userToken.roles?.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`)) || []
  const payload = {
    name: userToken.name || 'john smith',
    user_name: 'USER1',
    scope: ['read'],
    auth_source: 'nomis',
    authorities,
    jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
    client_id: 'clientid',
    user_uuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb'
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

const stubSignIn = () =>
  Promise.all([tokenStub(), stubOauthAuthorise(), signOut()])

const resetStubs = () =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

module.exports = { resetStubs, stubSignIn }
