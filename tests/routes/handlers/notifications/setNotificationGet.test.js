/* global describe, it, expect, jest */

const { notification } = require('../../../../server/config')
const get = require('../../../../server/routes/handlers/notifications/setNotification').get;

describe('setNotification Get handler', () => {
  // Mock the notification config
  jest.mock('../../../../server/config', () => ({
    username: process.env.NOTIFICATION_USERNAME || 'defaultUsername',
    password: process.env.NOTIFICATION_PASSWORD || 'defaultPassword',
  }));
  
  let req, res, getAsyncMock;

  beforeEach(() => {
    // Mock req and res objects
    req = {
      headers: {},
      redisClient: {
        getAsync: jest.fn()
      }
    };
    res = {
      setHeader: jest.fn(),
      sendStatus: jest.fn(),
      render: jest.fn()
    };

    // Mock the redis getAsync method
    getAsyncMock = req.redisClient.getAsync;
  });

  test('should return 401 when authorization header is missing', async () => {
    // Act
    await get()(req, res);

    // Assert
    expect(res.setHeader).toHaveBeenCalledWith('www-authenticate', 'Basic');
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  test('should return 401 when authorization is invalid', async () => {
    // Arrange
    req.headers.authorization = 'Basic ' + Buffer.from('wrongUsername:wrongPassword').toString('base64');

    // Act
    await get()(req, res);

    // Assert
    expect(res.setHeader).toHaveBeenCalledWith('www-authenticate', 'Basic');
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  test('should call render with current notification when authorization is valid', async () => {
    // Arrange
    const currentNotification = 'This is a notification';
    getAsyncMock.mockResolvedValue(currentNotification);
    req.headers.authorization = 'Basic ' + Buffer.from(`${notification.username}:${notification.password}`).toString('base64');

    // Act
    await get()(req, res);

    // Assert
    expect(getAsyncMock).toHaveBeenCalledWith('case-list-notification');
    expect(res.render).toHaveBeenCalledWith('set-notification', {
      title: 'Set notification',
      currentNotification
    });
  });

  test('should handle malformed authorization header', async () => {
    // Arrange
    req.headers.authorization = 'Basic malformedHeader';

    // Act
    await get()(req, res);

    // Assert
    expect(res.setHeader).toHaveBeenCalledWith('www-authenticate', 'Basic');
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});
