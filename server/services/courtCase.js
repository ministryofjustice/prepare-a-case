const apiUrl = require('../config').services.courtCase.url
const CourtCaseServiceError = require('./utils/CourtCaseServiceError')
const requestor = require('./utils/request')(CourtCaseServiceError)
const proxy = require('express-http-proxy')


module.exports = token => {

  const { getJSON, putJSON, postJSON, deleteJSON } = requestor(token)

  return {

    getCaseHistory: caseId => 
      getJSON({}, `${apiUrl}/cases/${caseId}`),

    getMatchDetails: defendantId => 
      getJSON({}, `${apiUrl}/defendant/${defendantId}/matchesDetail`),

    files: {

      delete: (hearingId, defendantId, fileId) =>
        deleteJSON({}, `${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/file/${fileId}`),

      post: (req, res, next, responseFormatter, hearingId, defendantId) =>
        proxy(apiUrl, {
          parseReqBody: false,
          proxyReqOptDecorator: proxyReqOpts => {
            proxyReqOpts.headers.Authorization = `Bearer ${token}`
            return proxyReqOpts
          },
          proxyReqPathResolver: () => {
            return `/hearing/${hearingId}/defendant/${defendantId}/file`
          },
          userResDecorator: (proxyRes, proxyResData) => {
            // anything 400+ will be forwarded to next() by the proxy however this still runs so we need to handle
            if (proxyRes.statusCode >= 400) {
              return proxyResData
            }
            if (proxyRes.statusCode === 201) {
              if (!proxyRes.rawHeaders.includes('application/json')) {
                throw new TypeError(
                  `Non JSON response for ${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/file`
                )
              }
              return JSON.stringify(
                responseFormatter(JSON.parse(proxyResData.toString('utf8')))
              )
            }
            throw new TypeError(
              `Invalid response status code for ${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/file`
            )
          }
        })(req, res, next),

      getRaw: (
        req,
        res,
        next,
        skipToNextHandlerFilter,
        hearingId,
        defendantId,
        fileId
      ) =>
        proxy(apiUrl, {
          proxyReqOptDecorator: proxyReqOpts => {
            proxyReqOpts.headers.Authorization = `Bearer ${token}`
            return proxyReqOpts
          },
          proxyReqPathResolver: () => {
            return `/hearing/${hearingId}/defendant/${defendantId}/file/${fileId}/raw`
          },
          skipToNextHandlerFilter
        })(req, res, next)
    },

    getCase: (hearingId, defendantId) =>
      getJSON({}, `${apiUrl}/hearing/${hearingId}/defendant/${defendantId}`),
    
    updateOffender: (defendantId, offenderData) =>
      putJSON({}, `${apiUrl}/defendant/${defendantId}/offender`, offenderData),
  
    deleteOffender: defendantId => 
      deleteJSON({}, `${apiUrl}/defendant/${defendantId}/offender`),
  
    addCaseComment: (caseId, defendantId, comment, author) =>
      postJSON({}, `${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments`, {
        caseId,
        comment,
        author
      }),

    updateCaseComment: (caseId, defendantId, commentId, comment, author) =>
      putJSON({}, `${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/${commentId}`, {
        caseId,
        comment,
        author
      }),

    deleteCaseComment: (caseId, defendantId, commentId) =>
      deleteJSON({}, `${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/${commentId}`),

    addHearingOutcome: (hearingId, defendantId, hearingOutcomeType) =>
      putJSON({}, `${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/outcome`, {
        hearingOutcomeType
      }),

    assignHearingOutcome: (hearingId, defendantId, assignedTo) =>
      putJSON({}, `${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/outcome/assign`, {
        assignedTo
      }),
    
    saveDraftCaseComment: (caseId, defendantId, comment, author) =>
      putJSON({}, `${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/draft`, {
        caseId,
        comment,
        author
      }),

    deleteCaseCommentDraft: async (caseId, defendantId) => {
      try {
        await deleteJSON({}, `${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/draft`)
      } catch (e) {
        if (e.response?.status === 404) {
          return // if the comment draft has never been saved, delete would return 404 which we should be ignoring it.
        }
        throw e
      }
    },

    getOutcomeTypes: () =>
      getJSON({}, `${apiUrl}/hearing-outcome-types`),

    addHearingNote:  (hearingId, note, author, defendantId) =>
      postJSON({}, `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes`,
        { hearingId, note, author }
      ),

    saveDraftHearingNote: (hearingId, note, author, defendantId) =>
      putJSON({}, `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/draft`,
        { hearingId, note, author }
      ),

    updateHearingNote: (hearingId, note, noteId, author, defendantId) =>
      putJSON({}, `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/${noteId}`,
        { hearingId, note, author, noteId }
      ),

    deleteHearingNote: (hearingId, noteId, defendantId) =>
      deleteJSON({}, `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/${noteId}`),

    deleteHearingNoteDraft: async (hearingId, defendantId) => {
      try {
        await deleteJSON({}, `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/draft`)
      } catch (e) {
        if (e.response?.status === 404) {
          return // if the note draft has never been saved, delete would return 404 which we should be ignoring it.
        }
        throw e
      }
    },

    updateHearingOutcomeToResulted: (hearingId, defendantId) =>
      postJSON(`${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/outcome/result`),

    searchCases: async (term, type, page, pageSize) => {
      try {
        return getJSON(`${apiUrl}/search`, {
          term,
          type,
          page,
          size: pageSize
        })
      } catch (e) {
        // TODO: why are we doing this, why should the service generate a 404?
        if (e.response?.status === 404) {
          return { data: {} }
        }
        throw e
      }
    },

}

/* TODO - EVERYTHING BELOW! */


const getCaseListFilters = require('../utils/getCaseListFilters')
const getLatestSnapshot = require('../utils/getLatestSnapshot')
const config = require('../config')
const { prepareCourtRoomFilters } = require('../routes/helpers')
const { settings } = require('../config')

const defaultFilterMatcher = (courtCase, filterObj, item) =>
  courtCase[filterObj.id]
    ? courtCase[filterObj.id].toString().toLowerCase() ===
      item.value.toString().toLowerCase()
    : false


const allowedSortValues = Object.freeze(['ASC', 'DESC'])
const allowedStates = Object.freeze(['NEW', 'IN_PROGRESS', 'RESULTED'])


    getPagedCaseList: async (
      courtCode,
      date,
      selectedFilters,
      subsection,
      page,
      pageSize,
      hearingOutcomesEnabled
    ) => {
      const apiUrlBuilder = new URL(`${apiUrl}/court/${courtCode}/cases`)

      apiUrlBuilder.searchParams.append('date', date)
      apiUrlBuilder.searchParams.append('VERSION2', 'true')
      apiUrlBuilder.searchParams.append('page', page || '1')
      apiUrlBuilder.searchParams.append('size', pageSize)

      if (subsection === 'added') {
        apiUrlBuilder.searchParams.append('recentlyAdded', 'true')
      }
      if (hearingOutcomesEnabled) {
        if (
          subsection === false ||
          subsection === null ||
          subsection === undefined
        ) {
          apiUrlBuilder.searchParams.append('hearingStatus', 'UNHEARD')
        }
        if (subsection === 'heard') {
          apiUrlBuilder.searchParams.append('hearingStatus', 'HEARD')
        }
      }

      if (selectedFilters) {
        const entries = Object.entries(selectedFilters)
        entries.forEach(entry => {
          if (Array.isArray(entry[1])) {
            entry[1].forEach(value => {
              if (entry[0] === 'courtRoom') {
                // courtRoom can be csv so append each room separately
                value
                  .split(',')
                  .forEach(courtRoom =>
                    apiUrlBuilder.searchParams.append(entry[0], courtRoom)
                  )
              } else {
                apiUrlBuilder.searchParams.append(entry[0], value)
              }
            })
          } else {
            apiUrlBuilder.searchParams.append(entry[0], entry[1].toString())
          }
        })
      }

      const response = await request(apiUrlBuilder.href)

      const caseListFilters = [
        {
          id: 'probationStatus',
          label: 'Probation status',
          items: [
            { value: 'CURRENT', label: 'Current' },
            { value: 'PREVIOUSLY_KNOWN', label: 'Previously known' },
            { value: 'NOT_SENTENCED', label: 'Pre-sentence record' },
            { value: 'NO_RECORD', label: 'No record' },
            {
              value: 'Possible NDelius record',
              label: 'Possible NDelius record'
            }
          ]
        },
        {
          id: 'courtRoom',
          label: 'Courtroom',
          items: prepareCourtRoomFilters(response.data?.courtRoomFilters)
        },
        {
          id: 'session',
          label: 'Session',
          items: [
            { value: 'MORNING', label: 'Morning' },
            { value: 'AFTERNOON', label: 'Afternoon' }
          ]
        }
      ]

      caseListFilters.push(
        {
          id: 'source',
          label: 'Source',
          items: [
            { label: 'Common Platform', value: 'COMMON_PLATFORM' },
            { label: 'Libra', value: 'LIBRA' }
          ]
        },
        {
          id: 'breach',
          label: 'Flag',
          items: [{ label: 'Breach', value: 'true' }]
        }
      )

      if (selectedFilters) {
        caseListFilters
          .filter(caseListFilter => !!selectedFilters[caseListFilter.id])
          .forEach(caseListFilter => {
            const selectedValues = selectedFilters[caseListFilter.id]
            const isCourt = caseListFilter.id === 'courtRoom'
            const multipleSelection = Array.isArray(selectedValues)
            caseListFilter.items.forEach(item => {
              // courtrooms can be arrays here and in selected filters they are csv so convert array to csv for comparison
              const compareItemValue =
                isCourt && Array.isArray(item.value)
                  ? item.value.join(',')
                  : item.value
              item.checked =
                item.checked ||
                (multipleSelection
                  ? selectedValues.includes(compareItemValue)
                  : selectedValues === compareItemValue)
            })
          })
      }

      return {
        ...response.data,
        filters: caseListFilters
      }
    },
    getCaseList: async (courtCode, date, selectedFilters, subsection) => {
      const latestSnapshot = getLatestSnapshot(date).format(
        'YYYY-MM-DDTHH:mm:00.000'
      )
      const response = await request(
        `${apiUrl}/court/${courtCode}/cases?date=${date}`
      )

      const { data } = response
      const filters = getCaseListFilters(data.cases, selectedFilters)
      const allCases = []
      const addedCases = []
      const removedCases = []
      let unmatchedRecords = 0
      if (data && data.cases) {
        data.cases.forEach($case => {
          if (
            $case.probationStatus.toLowerCase() === 'possible ndelius record' &&
            $case.numberOfPossibleMatches > 0
          ) {
            unmatchedRecords++
          }
          if ($case.createdToday) {
            allCases.push($case)
            addedCases.push($case)
          } else if ($case.removed) {
            removedCases.push($case)
          } else {
            allCases.push($case)
          }
        })
      }

      let filteredCases =
        subsection === 'added'
          ? addedCases
          : subsection === 'removed'
            ? removedCases
            : allCases

      function applyFilter (filterObj) {
        filteredCases = filteredCases.filter(courtCase => {
          let notFiltered = true
          let matched = false
          filterObj.items.forEach(item => {
            if (item && item.checked) {
              notFiltered = false
              matched =
                matched ||
                (filterObj.matcher
                  ? filterObj.matcher(courtCase, item)
                  : defaultFilterMatcher(courtCase, filterObj, item))
            }
          })
          return notFiltered || matched
        })
      }

      if (filters && filteredCases && !subsection) {
        filters.forEach(filterObj => {
          applyFilter(filterObj)
        })
      }

      return {
        ...data,
        totalCount: allCases.length,
        addedCount: addedCases.length,
        removedCount: removedCases.length,
        unmatchedRecords,
        filters,
        cases: filteredCases,
        snapshot: latestSnapshot
      }
    },

    getOutcomesList: async (courtCode, filters, sorts, state) => {
      const paramMap = new URLSearchParams()

      if (state && allowedStates.includes(state)) {
        paramMap.set('state', state)
      }

      const filtersCopy = {
        outcomeType: filters?.outcomeType,
        assignedToUuid: filters?.assignedToUuid,
        courtRoom: filters?.courtRoom
      }

      Object.keys(filtersCopy).forEach(key => {
        let values = filtersCopy[key]
        if (values) {
          if (key === 'courtRoom') {
            // courtroom can be csv of courtrooms
            if (Array.isArray(values)) {
              const courtRooms = []
              values = values.forEach(c => courtRooms.push(...c.split(',')))
              values = courtRooms
            } else {
              values = values.split(',')
            }
            filtersCopy[key] = values
          }
          if (Array.isArray(values)) {
            values.forEach(val => paramMap.append(key, val))
          } else {
            paramMap.append(key, values)
          }
        }
      })

      if (sorts && sorts.length) {
        sorts
          .filter(
            sort =>
              sort.value !== 'NONE' && allowedSortValues.includes(sort.value)
          )
          .forEach(sort => {
            paramMap.append('sortBy', sort.id)
            paramMap.append('order', sort.value)
          })
      }

      paramMap.set('page', `${filters?.page || 1}`)
      paramMap.set('size', `${settings.hearingOutcomesPageSize}`)

      const urlString = `${apiUrl}/courts/${courtCode}/hearing-outcomes?${paramMap}`

      const response = await request(urlString)

      return response.data
    },

  }
}