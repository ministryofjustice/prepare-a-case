const logger = require('../../log')

module.exports = function createUserService(authClientBuilder) {
  async function getUser(context) {
    try {
      const authClient = authClientBuilder(context.token)

      // Get the user record from Auth to determine whether this is an auth-only or Nomis account
      const user = await authClient.getUser()
      let nameForDisplay = null
      let roles = null

      user.displayName = user.name
      nameForDisplay = user.name
      roles = await authClient.getUserRoles()

      return {
        ...user,
        displayName: nameForDisplay,
        roles,
      }
    } catch (error) {
      logger.error('Error during getUser: ', error.stack)
      throw error
    }
  }

  async function getEmails(token, usernames) {
    try {
      const client = authClientBuilder(token)
      const requests = usernames.map(username => client.getEmail(username))
      const responses = await Promise.all(requests)

      const missing = responses.filter(email => !email.exists)
      const notVerified = responses.filter(email => !email.verified)
      const exist = responses.filter(email => email.email)

      return {
        exist,
        missing,
        notVerified,
        success: missing.length === 0 && notVerified.length === 0,
      }
    } catch (error) {
      logger.error('Error during getEmails: ', error.stack)
      throw error
    }
  }

  async function getUserDetails(context) {
    const authClient = authClientBuilder(context.token)
    let user = null

    user = await authClient.getUser(context.token)
    user.displayName = user.name

    return user
  }

  async function getUserRoles(context) {
    const authClient = authClientBuilder(context.token)
    const roles = await authClient.getUserRoles()
    return roles
  }

  return {
    getUser,
    getEmails,
    getUserDetails,
    getUserRoles,
  }
}
