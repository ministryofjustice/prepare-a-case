const appInsights = require('applicationinsights')
const applicationVersion = require('../application-version')
const { settings } = require('../config')

const { packageData, buildNumber } = applicationVersion
if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  if (!settings.reduceStdoutNoise) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')
  }
  appInsights.setup().setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C).start()
  module.exports = appInsights.defaultClient
  appInsights.defaultClient.context.tags['ai.cloud.role'] = `${packageData.name}`
  appInsights.defaultClient.context.tags['ai.application.ver'] = buildNumber
  appInsights.defaultClient.addTelemetryProcessor(addUserDataToRequests)
} else {
  module.exports = null
}

function addUserDataToRequests(envelope, contextObjects) {
  const isRequest = envelope.data.baseType === appInsights.Contracts.TelemetryTypeString.Request
  if (isRequest) {
    const { username } = contextObjects?.['http.ServerRequest']?.res?.locals?.user || {}
    if (username) {
      const { properties } = envelope.data.baseData
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData.properties = {
        username,
        ...properties,
      }
    }
  }
  return true
}