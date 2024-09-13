/* global describe, it, expect, jest */
const post = require('../../../../server/routes/handlers/notifications/setNotification').post;

describe('setNotification Post handler', () => {
  let req, res, setAsyncMock;

  beforeEach(() => {
    // Mock req and res objects
    req = {
      body: {
        notification: 'New notification',
        expires: '1' // 1 hour
      },
      redisClient: {
        setAsync: jest.fn()
      }
    };
    res = {
      redirect: jest.fn()
    };

    // Mock the redis setAsync method
    setAsyncMock = req.redisClient.setAsync;
  });

  test('should set notification and redirect to /set-notification (happy path)', async () => {
    // Arrange
    setAsyncMock.mockResolvedValue();

    // Act
    await post()(req, res);

    // Assert
    expect(setAsyncMock).toHaveBeenCalledWith(
      'case-list-notification',
      req.body.notification,
      'EX',
      60 * 60 * parseInt(req.body.expires, 10)
    );
    expect(res.redirect).toHaveBeenCalledWith(302, '/set-notification');
  });

  test('should handle an empty notification string', async () => {
    // Arrange
    req.body.notification = '';

    // Act
    await post()(req, res);

    // Assert
    expect(setAsyncMock).toHaveBeenCalledWith(
      'case-list-notification',
      '',
      'EX',
      60 * 60 * parseInt(req.body.expires, 10)
    );
    expect(res.redirect).toHaveBeenCalledWith(302, '/set-notification');
  });

  test('should handle very large expiration times', async () => {
    // Arrange
    req.body.expires = '1000'; // 1000 hours

    // Act
    await post()(req, res);

    // Assert
    expect(setAsyncMock).toHaveBeenCalledWith(
      'case-list-notification',
      req.body.notification,
      'EX',
      60 * 60 * parseInt(req.body.expires, 10)
    );
    expect(res.redirect).toHaveBeenCalledWith(302, '/set-notification');
  });
});
