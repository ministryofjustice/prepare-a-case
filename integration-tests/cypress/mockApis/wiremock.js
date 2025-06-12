const superagent = require('superagent')
import jwt from 'jsonwebtoken'

const url = 'http://localhost:9091/__admin'

const favicon = () =>
  superagent.post(`${url}/mappings`)
    .send({
    request: {
      method: 'GET',
      urlPattern: '/favicon.ico',
    },
    response: {
      status: 200,
    },
  })

const signOut = () =>
  superagent.post(`${url}/mappings`)
    .send({
    request: {
      method: 'GET',
      urlPattern: '/auth/logout.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body>Login page<h1>Sign in</h1></body></html>',
    },
  })

async function stubPing() {
  return superagent.post(`${url}/mappings`)
    .send({
      request: {
        method: 'GET',
        url: '/ping'
      },
      response: {
        headers: {
          'Content-Type': 'text/html',
        },
        status: 200,
        body: 'pong from wiremock'
      }
    })
}

async function stubOauthAuthorise() {
  return superagent.post(`${url}/mappings`)
    .send({
      request: {
        method: 'GET',
        // urlPath: '/auth/oauth/authorize',
        urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=(.+)&client_id=prepare-a-case-for-court'
      },
      response: {
        status: 302,
        headers: {
          'Content-Type': 'text/html',
          Location: 'http://localhost:3000/login/callback?code=codexxxx'
        },
        body: '<html><body>Login page<h1>Sign in</h1></body></html>',
      }
    })
}

//TODOLM remove token, use create token
async function tokenStub() {
  return superagent.post(`${url}/mappings`).send({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJJVEFHX1VTRVIiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiYXV0aF9zb3VyY2UiOiJkZWxpdXMiLCJuYW1lIjoiSm9lIEJsb2dncyIsInVzZXJfdXVpZCI6ImIyNjc5ZWY3LTA4NGQtNGY3Zi04MWRkLTJkNDRhYWU3NGNiYiIsImF1dGhvcml0aWVzIjpbIlJPTEVfUFJFUEFSRV9BX0NBU0UiXSwianRpIjoiODNiNTBhMTAtY2NhNi00MWRiLTk4NWYtZTg3ZWZiMzAzZGRiIiwiZXhwIjo5OTk5OTk5OTk5LCJjbGllbnRfaWQiOiJwcmVwYXJlLWEtY2FzZS1mb3ItY291cnQifQ.p0rnBlhIRw5wgQtIGh2kLUF4GdoDdUuyB1z4Mtt7NTU',
        token_type: 'Bearer',
        user_name: 'USER1',
        expires_in: 999999,
        scope: 'read write',
        internalUser: true,
        refresh_token: 'refresh'
      },
    },
  })
}

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
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

const resetStubs = () =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

module.exports = { stubPing, resetStubs, stubOauthAuthorise, tokenStub, favicon, signOut }
