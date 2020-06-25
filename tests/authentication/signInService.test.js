// eslint-disable-next-line no-unused-vars
/* global describe, beforeEach, afterEach, it, expect, jest, test */
const nock = require('nock')
const config = require('../../config')
const signInService = require('../../server/authentication/signInService')

describe('signInService', () => {
  let service
  let realDateNow

  beforeEach(() => {
    service = signInService()
    realDateNow = Date.now.bind(global.Date)
    const time = new Date('May 31, 2018 12:00:00')
    // @ts-ignore
    global.Date = jest.fn(() => time)
  })

  afterEach(() => {
    global.Date.now = realDateNow
  })

  describe('getUser', () => {
    const in15Mins = new Date('May 31, 2018 12:15:00').getTime()

    it('should return user object if all apis succeed', () => {
      const expectedOutput = {
        token: 'type token',
        refreshToken: 'refresh',
        username: 'un',
        refreshTime: in15Mins
      }

      return expect(service.getUser('type token', 'refresh', '1200', 'un')).toEqual(expectedOutput)
    })
  })

  describe('getRefreshToken', () => {
    let fakeOauthApi

    beforeEach(() => {
      fakeOauthApi = nock(config.apis.oauth2.url)
    })

    afterEach(() => {
      nock.cleanAll()
    })

    test('successfully get token', async () => {
      const expectedBody = 'grant_type=refresh_token&refresh_token=REFRESH_TOKEN-1'
      const in15Mins = new Date('May 31, 2018 12:15:00').getTime()
      fakeOauthApi
        .post('/oauth/token', expectedBody)
        .reply(200, { access_token: 'NEW_ACCESS_TOKEN-1', refresh_token: 'REFRESH_TOKEN-2', expires_in: 300 })

      const output = await service.getRefreshedToken({ username: 'Bob', refreshToken: 'REFRESH_TOKEN-1' })
      expect(output).toEqual({
        refreshTime: in15Mins,
        refreshToken: 'REFRESH_TOKEN-2',
        token: 'NEW_ACCESS_TOKEN-1'
      })
    })
  })
})
