const {
  initialiseTelemetry,
  flushTelemetry,
  telemetry
} = require('@ministryofjustice/hmpps-azure-telemetry')

const applicationVersion = require('../application-version')

const { packageData, buildNumber } = applicationVersion

initialiseTelemetry({
  serviceName: packageData.name,
  serviceVersion: buildNumber,
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  debug: process.env.DEBUG_TELEMETRY === 'true'
})
  .addFilter(
    telemetry.processors.filterSpanWherePath([
      '/health',
      '/assets/*',
      '/govuk/*',
      '/moj/*'
    ])
  )
  .addModifier(telemetry.processors.enrichSpanNameWithHttpRoute())
  .startRecording()

function toTelemetryAttributes (properties = {}) {
  return Object.entries(properties).reduce((attributes, [key, value]) => {
    if (value === undefined || value === null) {
      return attributes
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      attributes[key] = value
      return attributes
    }

    try {
      attributes[key] = JSON.stringify(value)
    } catch (error) {
      attributes[key] = String(value)
    }

    return attributes
  }, {})
}

/*
 * Compatibility wrapper for existing callers such as eventPublisher.
 * This can be removed later if callers are changed to use telemetry directly.
 */
const telemetryClient = {
  trackEvent: ({ name, properties = {} }) => {
    if (name) {
      telemetry.trackEvent(name, toTelemetryAttributes(properties))
    }
  }
}

module.exports = telemetryClient
module.exports.flushTelemetry = flushTelemetry