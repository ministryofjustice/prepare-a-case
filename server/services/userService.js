const logger = require('../../log')

module.exports = function createUserService (authClientBuilder) {
  async function getUser (context) {
    try {
      const authClient = authClientBuilder(context.token)

      // Get the user record from Auth to determine whether this is an auth-only or Nomis account
      const user = await authClient.getUser()

      return {
        ...user,
        displayName: user.name
      }
    } catch (error) {
      logger.error('Error during getUser: ', error.stack)
      throw error
    }
  }

  async function getEmails (token, usernames) {
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
        success: missing.length === 0 && notVerified.length === 0
      }
    } catch (error) {
      logger.error('Error during getEmails: ', error.stack)
      throw error
    }
  }

  return {
    getUser,
    getEmails
  }
}
