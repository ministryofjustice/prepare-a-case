const jwt = require('jsonwebtoken')
const { stubFor, getRequests } = require('./wiremock')

const createToken = () => {
  const payload = {
    user_name: 'ITAG_USER',
    scope: ['read', 'write'],
    auth_source: 'delius',
    uuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb',
    authorities: [
      'ROLE_PREPARE_A_CASE'
    ],
    jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
    client_id: 'prepare-a-case-for-court'
  }

  const token = jwt.sign(payload, 'secret', { expiresIn: '1h' })
  return token
}

const getLoginUrl = () =>
  getRequests().then(data => {
    const { requests } = data.body
    const stateParam = requests[0].request.queryParams.state
    const stateValue = stateParam ? stateParam.values[0] : requests[1].request.queryParams.state.values[0]
    return `/login/callback?code=codexxxx&state=${stateValue}`
  })

const favicon = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/favicon.ico'
    },
    response: {
      status: 200
    }
  })

const redirect = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=prepare-a-case-for-court'
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        Location: 'http://localhost:3007/login/callback?code=codexxxx&state=stateyyyy'
      },
      body: '<html><body>Login page<h1>Sign in</h1></body></html>'
    }
  })

const logout = () =>
  stubFor({
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

const token = () =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token'
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://localhost:3007/login/callback?code=codexxxx&state=stateyyyy'
      },
      jsonBody: {
        access_token: createToken(),
        token_type: 'bearer',
        refresh_token: 'refresh',
        user_name: 'TEST_USER',
        uuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb',
        expires_in: 600,
        scope: 'read write',
        internalUser: true
      }
    }
  })

const userMe = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/api/user/me'
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      jsonBody: {
        uuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb',
        name: 'Display Name'
      }
    }
  })

module.exports = {
  getLoginUrl,
  stubLogin: options => Promise.all([favicon(), redirect(), logout(), token(options), userMe()])
}
