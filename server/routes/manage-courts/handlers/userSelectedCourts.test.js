/* global jest, describe, it, expect */
const { get } = require('./userSelectedCourts')
const { settings } = require('../../../config')

describe('userSelectedCourts', () => {
  describe('GET Handler', () => {
    const userSelectedCourtsMock = jest.fn()
    const mockResponse = {
      locals:
        {
          user: {
            username: 'user-one'
          }
        },
      render: jest.fn()
    }
    const mockRequest = {
      session: {}
    }
    const subject = get(userSelectedCourtsMock)

    it('should render view-courts with required parameters when user preferences returns user courts', async () => {
      // Given
      const testUserCourts = {
        items: ['chosen-one', 'chosen-two']
      }
      userSelectedCourtsMock.mockReturnValueOnce(testUserCourts)

      // When
      await subject(mockRequest, mockResponse)

      expect(userSelectedCourtsMock).toHaveBeenCalledWith('user-one')
      expect(mockResponse.render).toHaveBeenCalledWith('view-courts', {
        params: {
          availableCourts: settings.availableCourts,
          chosenCourts: testUserCourts.items
        }
      })
    })

    it('should set chosen courts to empty array if the API does not return court items', async () => {
      // Given
      const testUserCourts = {}
      userSelectedCourtsMock.mockReturnValueOnce(testUserCourts)

      // When
      await subject(mockRequest, mockResponse)

      expect(userSelectedCourtsMock).toHaveBeenCalledWith('user-one')
      expect(mockResponse.render).toHaveBeenCalledWith('view-courts', {
        params: {
          availableCourts: settings.availableCourts,
          chosenCourts: []
        }
      })
    })

    it('should render error view when user preferences call fails', async () => {
      // Given
      const testUserCourts = {
        isError: true,
        status: 500
      }
      userSelectedCourtsMock.mockReturnValueOnce(testUserCourts)

      // When
      await subject(mockRequest, mockResponse)

      expect(userSelectedCourtsMock).toHaveBeenCalledWith('user-one')
      expect(mockResponse.render).toHaveBeenCalledWith('error', {
        status: 500
      })
    })
  })
})
