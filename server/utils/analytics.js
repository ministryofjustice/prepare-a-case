const appInsights = require('applicationinsights')

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start()
}

const trackEvent = (name, properties) => {
  if (name && appInsights.defaultClient) {
    appInsights.defaultClient.trackEvent({ name, properties })
    appInsights.defaultClient.flush()
  }
}

module.exports = trackEvent
