const ServiceError = require('./ServiceError')

class UserPreferenceServiceError extends ServiceError {
  constructor(message, request, response) {
    super(message, request, response)
    this.name = 'User Preference Service Error'
  }
}

module.exports = UserPreferenceServiceError