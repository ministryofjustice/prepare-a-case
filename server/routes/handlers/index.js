// A central file where all the handlers are created with necessary dependencies injected

const {
  getCaseList,
  getCase,
  addCaseComment,
  deleteCaseComment,
  addHearingNote,
  deleteHearingNote,
  deleteHearingNoteDraft,
  saveDraftHearingNote,
  updateHearingNote,
  searchCases,
  addHearingOutcome
} = require('../../services/case-service')
const { getProbationRecord } = require('../../services/community-service')
const { getUserSelectedCourts } = require('../../services/user-preference-service')
const getCaseSearchType = require('../../utils/getCaseSearchType')

const getCaseListHandler = require('./getCaseListRouteHandler')({ getCaseList })

const getCaseAndTemplateValues = require('./getCaseTemplateValuesHelper')({ getCase })

const getProbationRecordHandler = require('./getProbationRecordRouteHandler')({ getProbationRecord }, getCaseAndTemplateValues)

const getUserSelectedCourtsHandler = require('./getUserSelectedCourtsHandler')(getUserSelectedCourts)

const getCaseOutcomesRouteHandler = require('./getCaseOutcomesRouteHandler')()

const addCaseCommentRequestHandler = require('./getAddCommentRequestHandler')({ addCaseComment })

const deleteCaseCommentConfirmationHandler = require('./getDeleteCaseCommentConfirmationHandler')(getCaseAndTemplateValues)

const deleteCaseCommentHandler = require('./getDeleteCaseCommentHandler')({ deleteCaseComment })

const addHearingNoteRequestHandler = require('./getAddHearingNoteRequestHandler')({ addHearingNote })

const deleteHearingNoteConfirmationHandler = require('./getDeleteHearingNoteConfirmationHandler')(getCaseAndTemplateValues)

const deleteHearingNoteHandler = require('./getDeleteHearingNoteHandler')({ deleteHearingNote })

const autoSaveHearingNoteHandler = require('./getAutoSaveHearingNoteHandler')({ saveDraftHearingNote })

const autoSaveHearingNoteEditHandler = require('./getAutoSaveHearingNoteEditsHandler')({ updateHearingNote })

const caseSearchHandler = require('./getCaseSearchHandler')({ searchCases }, getCaseSearchType)

const cancelHearingNoteDraftHandler = require('./getCancelHearingNoteDraftHandler')({ deleteHearingNoteDraft })

const addHearingOutcomeHandler = require('./getAddHearingOutcomeHandler')({ addHearingOutcome })

module.exports = {
  getCaseListHandler,
  getCaseAndTemplateValues,
  getProbationRecordHandler,
  getUserSelectedCourtsHandler,
  getCaseOutcomesRouteHandler,
  addCaseCommentRequestHandler,
  deleteCaseCommentConfirmationHandler,
  deleteCaseCommentHandler,
  addHearingNoteRequestHandler,
  deleteHearingNoteConfirmationHandler,
  deleteHearingNoteHandler,
  cancelHearingNoteDraftHandler,
  autoSaveHearingNoteHandler,
  autoSaveHearingNoteEditHandler,
  caseSearchHandler,
  addHearingOutcomeHandler
}
