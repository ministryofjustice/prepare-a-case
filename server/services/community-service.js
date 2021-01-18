const { request, requestFile } = require('./utils/request')
const config = require('../../config')
const apiUrl = config.apis.courtCaseService.url

const getRequirements = async (convictions, crn, activeOnly) => {
  return Promise.all(
    convictions.map(async conviction => {
      if (conviction.sentence && (!activeOnly || (activeOnly && conviction.active))) {
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
  return res.status >= 400 ? res : res.data
}

const getProbationRecordWithRequirements = async (crn, activeOnly = false) => {
  const responseData = await getProbationRecord(crn)
  if (responseData && responseData.convictions) {
    const enrichedConvictions = await getRequirements(responseData.convictions, crn, activeOnly)
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
  const res = await requestFile(`${apiUrl}/offender/${crn}/documents/${documentId}`)
  return res
}

const getDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/detail`)
  return res.status >= 400 ? res : res.data
}

const getRiskDetails = async crn => {
  const res = await request(`${apiUrl}/offender/${crn}/registrations`)
  return res.data
}

module.exports = {
  getDetails,
  getProbationRecord,
  getProbationRecordWithRequirements,
  getSentenceDetails,
  getBreachDetails,
  getAttachment,
  getRiskDetails
}
