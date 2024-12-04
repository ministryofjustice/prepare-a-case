const appInsights = require('applicationinsights')

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup().setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C).start()
}

const trackEvent = (name, properties) => {
  if (name && appInsights.defaultClient) {
    appInsights.defaultClient.trackEvent({ name, properties })
    appInsights.defaultClient.flush()
  }
}

module.exports = trackEvent
