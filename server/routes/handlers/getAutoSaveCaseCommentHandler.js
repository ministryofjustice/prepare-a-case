const logger = require('../../../log')

const getAutoSaveCaseCommentHandler = ({ saveDraftCaseComment }) => async (req, res) => {
  const { body: { caseId, comment } } = req

  if (comment) {
    const response = await saveDraftCaseComment(caseId, comment, res.locals.user.name)
    if (response.status < 200 || response.status > 399) {
      logger.warn('Error while saving comment draft', { status: response.status, response: response.data, caseId })
    }
    res.send(response.data, response.status)
  } else {
    logger.warn('Empty comment received to auto-save', { caseId })
    res.sendStatus(200)
  }
}

module.exports = getAutoSaveCaseCommentHandler