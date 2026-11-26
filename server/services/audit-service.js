const { AuditServiceFactory } = require('@ministryofjustice/hmpps-audit-client')
const logger = require('../log')

module.exports = AuditServiceFactory.configureFromEnv(logger)