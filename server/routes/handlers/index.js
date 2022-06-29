// A central file where all the handlers are created with necessary dependencies injected

const { getCaseList, getCase } = require('../../services/case-service')
const { getProbationRecord } = require('../../services/community-service')

const getCaseListHandler = require('./getCaseListRouteHandler')({ getCaseList })

const getCaseAndTemplateValues = require('./getCaseTemplateValuesHelper')({ getCase })

const getProbationRecordHandler = require('./getProbationRecordRouteHandler')({ getProbationRecord }, getCaseAndTemplateValues)

module.exports = {
  getCaseListHandler,
  getCaseAndTemplateValues,
  getProbationRecordHandler
}