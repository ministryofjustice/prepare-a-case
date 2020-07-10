/* global describe, beforeEach, afterEach, it, expect, jest */
const serviceCreator = require('../../server/services/userService')

const context = { username: 'test', token: 'token-1' }

const authClient = {
  getUser: jest.fn(),
  getUserRoles: jest.fn(),
  getEmail: jest.fn()
}

const authClientBuilder = jest.fn()

let service

beforeEach(() => {
  authClientBuilder.mockReturnValue(authClient)
  service = serviceCreator(authClientBuilder)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Auth users - getUser()', () => {
  it('should retrieve auth user details', async () => {
    const authUser = {
      active: true,
      name: 'Sam Smith',
      authSource: 'auth',
      displayName: 'Sam Smith',
      exists: true,
      verified: true
    }
    authClient.getUser.mockReturnValue(authUser)

    const roles = [{ roleCode: 'GLOBAL_SEARCH' }, { roleCode: 'PATHFINDER_OM' }]
    authClient.getUserRoles.mockReturnValue(roles)

    const result = await service.getUser(context)

    expect(result).toEqual({
      ...authUser,
      displayName: 'Sam Smith',
      roles: [{ roleCode: 'GLOBAL_SEARCH' }, { roleCode: 'PATHFINDER_OM' }]
    })

    expect(authClientBuilder).toBeCalledWith(context.token)
  })
})

describe('Email addresses', () => {
  it('All emails returned successfully', async () => {
    const user1 = { username: 'Bob', email: 'an@email.com', exists: true, verified: true }
    const user2 = { username: 'June', email: 'an@email.com', exists: true, verified: true }

    authClient.getEmail.mockResolvedValueOnce(user1).mockResolvedValueOnce(user2)

    const result = await service.getEmails(context.token, ['Bob', 'June'])

    expect(result).toEqual({
      exist: [
        {
          email: 'an@email.com',
          exists: true,
          username: 'Bob',
          verified: true
        },
        {
          email: 'an@email.com',
          exists: true,
          username: 'June',
          verified: true
        }
      ],
      missing: [],
      notVerified: [],
      success: true
    })
  })

  it('should return selected email address only', async () => {
    const user1 = { username: 'Bob', email: 'an@email.com', exists: true, verified: true }
    const user2 = { username: 'June', exists: false, verified: true }

    authClient.getEmail.mockResolvedValueOnce(user1).mockResolvedValueOnce(user2)

    const result = await service.getEmails(context.token, ['Bob', 'June'])

    expect(result).toEqual({
      exist: [
        {
          email: 'an@email.com',
          exists: true,
          username: 'Bob',
          verified: true
        }
      ],
      missing: [{ exists: false, username: 'June', verified: true }],
      notVerified: [],
      success: false
    })
  })

  it('should return one unverified email address', async () => {
    const user1 = { username: 'Bob', email: 'an@email.com', exists: true, verified: true }
    const user2 = { username: 'June', exists: true, verified: false }

    authClient.getEmail.mockResolvedValueOnce(user1).mockResolvedValueOnce(user2)

    const result = await service.getEmails(context.token, ['Bob', 'June'])

    expect(result).toEqual({
      exist: [
        {
          email: 'an@email.com',
          exists: true,
          username: 'Bob',
          verified: true
        }
      ],
      missing: [],
      notVerified: [{ exists: true, username: 'June', verified: false }],
      success: false
    })
  })

  it('should use the user token to call auth service', async () => {
    const user1 = { username: 'Bob', email: 'an@email.com' }

    authClient.getEmail.mockReturnValue(user1)

    await service.getEmails(context.token, ['Bob'])

    expect(authClientBuilder).toBeCalledWith(context.token)
  })

  it('should return roles for a user', async () => {
    const roles = [{ roleCode: 'ROLE_PREPARE_A_CASE' }]
    authClient.getUserRoles.mockReturnValue(roles)

    const rolesReturned = await service.getUserRoles(context.token)

    expect(rolesReturned).toEqual(roles)
  })
})
