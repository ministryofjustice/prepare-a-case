const telemetryClient = require('./azure-appinsights')
const { getUserUuid } = require('./userContext')

const trackEvent = (name, properties) => {
  if (name) {
    const userUuid = getUserUuid()
    const eventProperties = properties && typeof properties === 'object' && !Array.isArray(properties)
      ? { ...properties }
      : {}

    if (userUuid) {
      eventProperties.userUuid = userUuid
    }

    telemetryClient.trackEvent({ name, properties: eventProperties })
  }
}

module.exports = trackEvent
