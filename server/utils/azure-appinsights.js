const appInsights = require('applicationinsights')
const applicationVersion = require('../application-version')

const defaultName = () => {
  const {
    packageData: { name }
  } = applicationVersion
  return name
}

module.exports = (name = defaultName()) => {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')
    appInsights
      .setup()
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .start()
    const client = appInsights.defaultClient
    client.context.tags['ai.cloud.role'] = `${name}`
    return client
  }
  return null
}
