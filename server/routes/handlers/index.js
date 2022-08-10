// A central file where all the handlers are created with necessary dependencies injected

const { getCaseList, getCase, addCaseComment } = require('../../services/case-service')
const { getProbationRecord } = require('../../services/community-service')
const { getUserSelectedCourts } = require('../../services/user-preference-service')

const getCaseListHandler = require('./getCaseListRouteHandler')({ getCaseList })

const getCaseAndTemplateValues = require('./getCaseTemplateValuesHelper')({ getCase })

const getProbationRecordHandler = require('./getProbationRecordRouteHandler')({ getProbationRecord }, getCaseAndTemplateValues)

const getUserSelectedCourtsHandler = require('./getUserSelectedCourtsHandler')(getUserSelectedCourts)

const addCaseCommentRequestHandler = require('./getAddCommentRequestHandler')({ addCaseComment })

module.exports = {
  getCaseListHandler,
  getCaseAndTemplateValues,
  getProbationRecordHandler,
  getUserSelectedCourtsHandler,
  addCaseCommentRequestHandler
}
