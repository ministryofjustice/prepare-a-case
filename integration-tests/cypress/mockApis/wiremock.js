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

async function stubFont() {
  return superagent.post(`${url}/mappings`)
    .send({
      request: {
        method: 'GET',
        urlPattern: '/__/fonts/*'
      },
      response: {
        status: 200,
      }
    })
}

async function stubOauthAuthorise() {
  return superagent.post(`${url}/mappings`)
    .send({
      request: {
        method: 'GET',
        urlPath: '/auth/oauth/authorize',
        // urlPattern: '/auth/oauth/authorize?'
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          Location: 'http://localhost:3000/login/callback?code=codexxxx'
        },
        // body: '<html><body>Login page<h1>Sign in</h1></body></html>',
        jsonBody: {
          access_token: createToken({ roles: ['PREPARE-A-CASE'] }),
          token_type: 'bearer',
          user_name: 'USER1',
          expires_in: 599,
          scope: 'read',
          internalUser: true,
        },
      }
    })
}

const tokenStub = () =>
  superagent.post(`${url}/mappings`).send({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://localhost:3000/login/callback?code=codexxxx',
      },
      jsonBody: {
        access_token: createToken({ roles: ['PREPARE-A-CASE'] }),
        token_type: 'bearer',
        user_name: 'USER1',
        expires_in: 599,
        scope: 'read',
        internalUser: true,
      },
    },
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
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

async function stubVerifyToken() {
  return superagent.post(`${url}/mappings`).send({
    request: {
      method: 'POST',
      urlPattern: '/verification/token/verify',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { active: true },
    },
  })
}

const getSignInUrl = () =>
  superagent.post(`${url}/requests/find`).send({
    method: 'GET',
    urlPath: '/auth/oauth/authorize',
  }).then(data => {
    // const { requests } = data.body
    // const stateValue = requests[requests.length - 1].queryParams.state.values[0]
    // return `/sign-in/callback?code=codexxxx` //should be login/ ?
  })

const stubSignIn = () =>
  Promise.all([favicon(), stubOauthAuthorise(), signOut(), tokenStub(), stubVerifyToken()])

const resetStubs = () =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

module.exports = { stubPing, resetStubs, stubOauthAuthorise, tokenStub, favicon, signOut, stubSignIn, stubVerifyToken, stubFont, getSignInUrl }
