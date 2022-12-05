const { request, update, httpDelete, create } = require('./utils/request')
const getCaseListFilters = require('../utils/getCaseListFilters')
const getLatestSnapshot = require('../utils/getLatestSnapshot')
const config = require('../../config')
const { settings } = require('../../config')

const isHttpSuccess = response => {
  return response && response.status / 100 === 2
}

const getInternalServerErrorResponse = res => ({ isError: true, status: res?.status || 500 })

const createCaseService = (apiUrl) => {
  return {
    getCaseHistory: async (caseId) => {
      const res = await request(`${apiUrl}/cases/${caseId}`)
      return res.data
    },
    getMatchDetails: async (defendantId) => {
      const res = await request(`${apiUrl}/defendant/${defendantId}/matchesDetail`) || { data: {} }
      return res.data
    },
    getCaseList: async (courtCode, date, selectedFilters, subsection, page) => {
      const searchParams = {
        ...selectedFilters,
        page,
        pageSize: settings.casesPerPage,
        recentlyAdded: subsection && subsection === 'added' ? true : null
      }

      const latestSnapshot = getLatestSnapshot(date).format('YYYY-MM-DDTHH:mm:00.000')
      const response = await request(`${apiUrl}/court/${courtCode}/cases?date=${date}`, searchParams)
      if (!isHttpSuccess(response)) {
        return getInternalServerErrorResponse(response)
      }
      const { data } = response
      const filters = getCaseListFilters(data, selectedFilters)

      return {
        ...data,
        totalCount: data.totalCount,
        addedCount: data.recentlyAdded,
        removedCount: data.removedCases,
        unmatchedRecords: data.possibleNdeliusRecords,
        filters,
        cases: data.cases,
        snapshot: latestSnapshot
      }
    },
    getCase: async (hearingId, defendantId) => {
      const res = await request(`${apiUrl}/hearing/${hearingId}/defendant/${defendantId}`)
      if (!isHttpSuccess(res)) {
        return getInternalServerErrorResponse(res)
      }
      return res.data
    },
    updateOffender: async (defendantId, offenderData) => {
      return await update(`${apiUrl}/defendant/${defendantId}/offender`, offenderData)
    },
    deleteOffender: async (defendantId) => {
      return await httpDelete(`${apiUrl}/defendant/${defendantId}/offender`)
    },
    addCaseComment: async (caseId, comment, author) => await create(`${apiUrl}/cases/${caseId}/comments`, { caseId, comment, author }),
    deleteCaseComment: async (caseId, commentId) => await httpDelete(`${apiUrl}/cases/${caseId}/comments/${commentId}`),
    addHearingNote: async (hearingId, note, author) => await create(`${apiUrl}/hearing/${hearingId}/notes`, { hearingId, note, author }),
    deleteHearingNote: async (hearingId, noteId) => await httpDelete(`${apiUrl}/hearing/${hearingId}/notes/${noteId}`)
  }
}

const defaultService = createCaseService(config.apis.courtCaseService.url)

module.exports = {
  ...defaultService,
  createCaseService
}
