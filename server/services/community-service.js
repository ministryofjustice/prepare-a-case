const { request } = require('./utils/request')
const config = require('../../config')
const apiUrl = config.apis.courtCaseService.url

const getRequirements = async (convictions, crn) => {
  return Promise.all(
    convictions.map(async conviction => {
      if (conviction.sentence) {
        const res = await request(`${apiUrl}/offender/${crn}/convictions/${conviction.convictionId}/requirements`)
        return { ...conviction, ...res.data }
      } else {
        return conviction
      }
    })
  )
}

const getProbationRecord = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/probation-record`)
  return res.data
}

const getProbationRecordWithRequirements = async crn => {
  const responseData = await getProbationRecord(crn)
  if (responseData && responseData.convictions) {
    const enrichedConvictions = await getRequirements(responseData.convictions, crn)
    return {
      ...responseData,
      convictions: enrichedConvictions
    }
  }
  return responseData
}

const getSentenceDetails = async (crn, convictionId, sentenceId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}/sentences/${sentenceId}`)
  return res.data
}

const getBreachDetails = async (crn, convictionId, breachId) => {
  const res = await request(`${apiUrl}/offender/${crn}/convictions/${convictionId}/breaches/${breachId}`)
  return res.data
}

const getAttachment = async (crn, documentId) => {
  const res = await request(`${apiUrl}/offender/${crn}/documents/${documentId}`)
  return res.data
}

module.exports = {
  getProbationRecord,
  getProbationRecordWithRequirements,
  getSentenceDetails,
  getBreachDetails,
  getAttachment
}
