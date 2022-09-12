// A central file where all the handlers are created with necessary dependencies injected

const { getCaseList, getCase, addCaseComment, deleteCaseComment, addCaseNote } = require('../../services/case-service')
const { getProbationRecord } = require('../../services/community-service')
const { getUserSelectedCourts } = require('../../services/user-preference-service')

const getCaseListHandler = require('./getCaseListRouteHandler')({ getCaseList })

const getCaseAndTemplateValues = require('./getCaseTemplateValuesHelper')({ getCase })

const getProbationRecordHandler = require('./getProbationRecordRouteHandler')({ getProbationRecord }, getCaseAndTemplateValues)

const getUserSelectedCourtsHandler = require('./getUserSelectedCourtsHandler')(getUserSelectedCourts)

const addCaseCommentRequestHandler = require('./getAddCommentRequestHandler')({ addCaseComment })

const deleteCaseCommentConfirmationHandler = require('./getDeleteCaseCommentConfirmationHandler')(getCaseAndTemplateValues)

const deleteCaseCommentHandler = require('./getDeleteCaseCommentHandler')({ deleteCaseComment })

const addCaseNoteRequestHandler = require('./getAddCaseNoteRequestHandler')({ addCaseNote })

module.exports = {
  getCaseListHandler,
  getCaseAndTemplateValues,
  getProbationRecordHandler,
  getUserSelectedCourtsHandler,
  addCaseCommentRequestHandler,
  deleteCaseCommentConfirmationHandler,
  deleteCaseCommentHandler,
  addCaseNoteRequestHandler
}
