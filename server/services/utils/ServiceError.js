/*
 * A base Error uses across all services
 */
class ServiceError extends Error {
  constructor(message, request, response) {
    super(message)
    this.request = request
    this.response = response
  }
}

module.exports = ServiceError