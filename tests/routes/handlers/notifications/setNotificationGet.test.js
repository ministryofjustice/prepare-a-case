/* global describe, beforeEach, expect, jest, test */

jest.mock('../../../../server/config', () => ({
  notification: {
    username: 'test',
    password: 'test'
  }
}))

const { notification } = require('../../../../server/config')
const { get } = require('../../../../server/routes/handlers/notifications/setNotification')

describe('setNotification Get handler', () => {
  let req, res, getAsyncMock

  beforeEach(() => {
    req = {
      headers: {},
      redisClient: {
        getAsync: jest.fn()
      }
    }
    res = {
      setHeader: jest.fn(),
      sendStatus: jest.fn(),
      render: jest.fn()
    }
    getAsyncMock = req.redisClient.getAsync
  })

  test('should return 401 when authorization header is missing', async () => {
    await get()(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('www-authenticate', 'Basic')
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  test('should return 401 when authorization is invalid', async () => {
    req.headers.authorization =
      'Basic ' + Buffer.from('wrongUsername:wrongPassword').toString('base64')

    await get()(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('www-authenticate', 'Basic')
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  test('should call render with current notification when authorization is valid', async () => {
    const currentNotification = 'This is a notification'
    getAsyncMock.mockResolvedValue(currentNotification)

    req.headers.authorization =
      'Basic ' +
      Buffer.from(`${notification.username}:${notification.password}`).toString('base64')

    await get()(req, res)

    expect(getAsyncMock).toHaveBeenCalledWith('case-list-notification')
    expect(res.render).toHaveBeenCalledWith('set-notification', {
      title: 'Set notification',
      currentNotification
    })
  })

  test('should handle malformed authorization header', async () => {
    req.headers.authorization = 'Basic malformedHeader'

    await get()(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('www-authenticate', 'Basic')
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })
})
