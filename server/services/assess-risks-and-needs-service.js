const { send } = require('./utils/request')
const config = require('../../config')

const arnConfig = config.apis.assessRisksAndNeedsService
const isEnabled = (enabledFlag) => enabledFlag === true || enabledFlag === 'true'

const presentenceAssessmentEnabled = isEnabled(arnConfig.enable)
const arnUrl = presentenceAssessmentEnabled && arnConfig.url

const startPresentenceAssessment = async (courtCode, caseNo, tokens) => {
  if (!presentenceAssessmentEnabled) throw new Error('Presentence Assessment is not available')

  return await send(
    `${arnUrl}/${courtCode}/case/${caseNo}`,
    { },
    tokens
  )
}

module.exports = {
  startPresentenceAssessment,
  presentenceAssessmentEnabled
}
