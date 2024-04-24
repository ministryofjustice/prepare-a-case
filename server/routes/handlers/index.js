// A central file where all the handlers are created with necessary dependencies injected

const {
  getPagedCaseList,
  getCase,
  addCaseComment,
  deleteCaseComment,
  addHearingNote,
  deleteHearingNote,
  deleteHearingNoteDraft,
  saveDraftHearingNote,
  updateHearingNote,
  searchCases,
  addHearingOutcome,
  saveDraftCaseComment,
  deleteCaseCommentDraft,
  updateCaseComment,
  updateHearingOutcomeToResulted
} = require('../../services/case-service')
const { getProbationRecord } = require('../../services/community-service')
const { getUserSelectedCourts } = require('../../services/user-preference-service')
const getCaseSearchType = require('../../utils/getCaseSearchType')
const getOutcomeTypesListFilters = require('../../utils/getOutcomeTypesListFilters')
const nunjucksFilters = require('../../utils/nunjucksFilters')

const getCaseAndTemplateValues = require('./getCaseTemplateValuesHelper')({ getCase })

const getProbationRecordHandler = require('./getProbationRecordRouteHandler')({ getProbationRecord }, getCaseAndTemplateValues)

const getUserSelectedCourtsHandler = require('./getUserSelectedCourtsHandler')(getUserSelectedCourts)

const outcomesRouter = require('./outcomes')

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
const editHearingOutcomeHandler = require('./getEditHearingOutcomeHandler')({ addHearingOutcome })

const autoSaveCaseCommentHandler = require('./getAutoSaveCaseCommentHandler')({ saveDraftCaseComment })

const cancelCaseCommentDraftHandler = require('./getCancelCaseCommentDraftHandler')({ deleteCaseCommentDraft })

const updateCaseCommentHandler = require('./getUpdateCommentRequestHandler')({ updateCaseComment })

const pagedCaseListRouteHandler = require('./getPagedCaseListRouteHandler')({ getPagedCaseList })

const caseSummaryHandler = require('./caseSummary')({ getOutcomeTypesListFilters, getCaseAndTemplateValues, nunjucksFilters, updateHearingOutcomeToResulted })

module.exports = {
  getCaseAndTemplateValues,
  getProbationRecordHandler,
  getUserSelectedCourtsHandler,
  outcomesRouter,
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
  addHearingOutcomeHandler,
  editHearingOutcomeHandler,
  autoSaveCaseCommentHandler,
  cancelCaseCommentDraftHandler,
  updateCaseCommentHandler,
  pagedCaseListRouteHandler,
  caseSummaryHandler
}
