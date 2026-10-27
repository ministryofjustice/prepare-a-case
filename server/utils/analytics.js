const telemetryClient = require('./azure-appinsights')

const trackEvent = (name, properties) => {
  if (name) {
    telemetryClient.trackEvent({ name, properties })
  }
}

module.exports = trackEvent
