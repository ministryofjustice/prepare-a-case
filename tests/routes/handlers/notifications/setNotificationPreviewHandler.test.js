/* global describe, it, expect, jest */
const setNotificationPreview = require('../../../../server/routes/handlers/notifications/setNotificationPreview');

describe('setNotificationPreviewHandler', () => {
    let req, res, getAsyncMock;
  
    beforeEach(() => {
      // Mock the request and response objects
      req = {
        redisClient: {
          getAsync: jest.fn()
        }
      };
      res = {
        render: jest.fn()
      };
  
      // Mock the getAsync function
      getAsyncMock = req.redisClient.getAsync;
    });
  
    test('should render the set-notification-preview view with currentNotification (happy path)', async () => {
      // Arrange
      const mockNotification = 'Test notification';
      getAsyncMock.mockResolvedValue(mockNotification);
  
      // Act
      await setNotificationPreview()(req, res);
  
      // Assert
      expect(getAsyncMock).toHaveBeenCalledWith('case-list-notification');
      expect(res.render).toHaveBeenCalledWith('set-notification-preview', {
        currentNotification: mockNotification
      });
    });
  
    test('should render with null if no notification is present in Redis', async () => {
      // Arrange
      getAsyncMock.mockResolvedValue(null);
  
      // Act
      await setNotificationPreview()(req, res);
  
      // Assert
      expect(getAsyncMock).toHaveBeenCalledWith('case-list-notification');
      expect(res.render).toHaveBeenCalledWith('set-notification-preview', {
        currentNotification: null
      });
    });
  });