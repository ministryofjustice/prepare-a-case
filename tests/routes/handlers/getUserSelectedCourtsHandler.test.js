/* global jest, describe, it, expect */
const getUserSelectedCourtsHandler = require('../../../server/routes/handlers/getUserSelectedCourtsHandler')
const { settings } = require('../../../config')

describe('getUserSelectedCourtsHandler', () => {
  const getUserSelectedCourtsMock = jest.fn()
  const mockResponse = {
    locals:
      {
        user: {
          userId: 'user-one'
        }
      },
    render: jest.fn()
  }
  const mockRequest = {
    session: {}
  }
  const subject = getUserSelectedCourtsHandler(getUserSelectedCourtsMock)

  it('should render view-courts with required parameters when user preferences returns user courts', async () => {
    // Given
    const testUserCourts = {
      items: ['chosen-one', 'chosen-two']
    }
    getUserSelectedCourtsMock.mockReturnValueOnce(testUserCourts)

    // When
    await subject(mockRequest, mockResponse)

    expect(getUserSelectedCourtsMock).toHaveBeenCalledWith('user-one')
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
    getUserSelectedCourtsMock.mockReturnValueOnce(testUserCourts)

    // When
    await subject(mockRequest, mockResponse)

    expect(getUserSelectedCourtsMock).toHaveBeenCalledWith('user-one')
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
    getUserSelectedCourtsMock.mockReturnValueOnce(testUserCourts)

    // When
    await subject(mockRequest, mockResponse)

    expect(getUserSelectedCourtsMock).toHaveBeenCalledWith('user-one')
    expect(mockResponse.render).toHaveBeenCalledWith('error', {
      status: 500
    })
  })
})
