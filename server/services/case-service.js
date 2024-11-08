const { request, update, httpDelete, create } = require('./utils/request')
const getCaseListFilters = require('../utils/getCaseListFilters')
const getLatestSnapshot = require('../utils/getLatestSnapshot')
const config = require('../config')
const { prepareCourtRoomFilters } = require('../routes/helpers')
const { settings } = require('../config')
const proxy = require('express-http-proxy')
const trackEvent = require('../utils/analytics')

const isHttpSuccess = response => {
  return response && response.status / 100 === 2
}

const getInternalServerErrorResponse = res => ({
  isError: true,
  status: res?.status || 500
})

const defaultFilterMatcher = (courtCase, filterObj, item) =>
  courtCase[filterObj.id]
    ? courtCase[filterObj.id].toString().toLowerCase() ===
    item.value.toString().toLowerCase()
    : false

const allowedSortValues = ['ASC', 'DESC']
const allowedStates = ['NEW', 'IN_PROGRESS', 'RESULTED']

const createCaseService = apiUrl => {
  return {
    getCaseHistory: async caseId => {
      const res = await request(`${apiUrl}/cases/${caseId}`)
      return res.data
    },
    getMatchDetails: async (defendantId, showAllMatches) => {
      showAllMatches = Boolean(showAllMatches)
      const res = (await request(
        `${apiUrl}/defendant/${defendantId}/matchesDetail`
      ) || { data: {} })

      if (settings.enableMatcherLogging) {
        trackEvent('PiCMatcherLoggingServiceFirst', res)
      }
      // Sort offenderMatchDetails based on matchProbability in descending order
      if (Array.isArray(res.data.offenderMatchDetails)) {
        res.data.offenderMatchDetails.sort((a, b) => {
          const probA = parseFloat(a.matchProbability ?? 0)
          const probB = parseFloat(b.matchProbability ?? 0)
          return probB - probA // Descending order
        })

        if (!showAllMatches) {
          // Filter out details where matchProbability is less than settings.minimumMatchProbability
          res.data.offenderMatchDetails = res.data.offenderMatchDetails.filter(detail => {
            const matchProb = parseFloat(detail.matchProbability ?? 0)
            return matchProb >= parseFloat(settings.minimumMatchProbability)
          })
        }
      } else {
        res.data.offenderMatchDetails = []
      }

      if (settings.enableMatcherLogging) {
        trackEvent('PiCMatcherLoggingServiceLast', res)
      }

      return res.data
    },
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
      if (!isHttpSuccess(response)) {
        return getInternalServerErrorResponse(response)
      }

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
      if (!isHttpSuccess(response)) {
        return getInternalServerErrorResponse(response)
      }
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

    workflow: {
      tasks: {
        state: {
          set: (taskId, state, { hearingId, defendantId }) =>
            /* Note the original concept was workflow orientated using
              `${apiUrl}/workflow/tasks/${taskId}/state?hearing=${hearingId}&defendant=${defendantId}`
              (which would ideally be)
              `${apiUrl}/workflow/${workflowId}/tasks/${taskId}/state`
              however ccs implemented the pattern as below
            */
            update(`${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/prep-status/${state}`)
        }
      }
    },

    files: {
      delete: (hearingId, defendantId, fileId) =>
        httpDelete(
          `${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/file/${fileId}`
        ),
      post: (req, res, next, responseFormatter, hearingId, defendantId) =>
        proxy(apiUrl, {
          parseReqBody: false,
          timeout: 12500,
          proxyReqOptDecorator: proxyReqOpts => {
            proxyReqOpts.headers.Authorization = `Bearer ${req.user.token}`
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
          timeout: 12500,
          proxyReqOptDecorator: proxyReqOpts => {
            proxyReqOpts.headers.Authorization = `Bearer ${req.user.token}`
            return proxyReqOpts
          },
          proxyReqPathResolver: () => {
            return `/hearing/${hearingId}/defendant/${defendantId}/file/${fileId}/raw`
          },
          skipToNextHandlerFilter
        })(req, res, next)
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
      if (!isHttpSuccess(response)) {
        return getInternalServerErrorResponse(response)
      }
      return response.data
    },

    updateHearingOutcomeToResulted: async (hearingId, defendantId, correlationId) => {
      const urlString = `${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/outcome/result?correlationId=${correlationId}`
      await create(urlString)
    },

    searchCases: async (term, type, page, pageSize) => {
      try {
        return await request(`${apiUrl}/search`, {
          term,
          type,
          page,
          size: pageSize
        })
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return { data: {} }
        }
        throw e
      }
    },

    getCase: async (hearingId, defendantId) => {
      const res = await request(
        `${apiUrl}/hearing/${hearingId}/defendant/${defendantId}`
      )
      if (!isHttpSuccess(res)) {
        return getInternalServerErrorResponse(res)
      }
      return res.data
    },
    updateOffender: async (defendantId, offenderData) => {
      return await update(
        `${apiUrl}/defendant/${defendantId}/offender`,
        offenderData
      )
    },
    deleteOffender: async defendantId => {
      return await httpDelete(`${apiUrl}/defendant/${defendantId}/offender`)
    },
    addCaseComment: async (caseId, defendantId, comment, author) =>
      await create(`${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments`, {
        caseId,
        comment,
        author
      }),
    updateCaseComment: async (caseId, defendantId, commentId, comment, author) =>
      await update(`${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/${commentId}`, {
        caseId,
        comment,
        author
      }),
    deleteCaseComment: async (caseId, defendantId, commentId) => {
      await httpDelete(`${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/${commentId}`)
    },
    addHearingNote: async (hearingId, note, author, defendantId) =>
      await create(
        `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes`,
        { hearingId, note, author }
      ),
    saveDraftHearingNote: async (hearingId, note, author, defendantId) =>
      await update(
        `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/draft`,
        { hearingId, note, author }
      ),
    updateHearingNote: async (hearingId, note, noteId, author, defendantId) =>
      await update(
        `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/${noteId}`,
        { hearingId, note, author, noteId }
      ),
    deleteHearingNote: async (hearingId, noteId, defendantId) =>
      await httpDelete(
        `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/${noteId}`
      ),
    deleteHearingNoteDraft: async (hearingId, defendantId) => {
      try {
        await httpDelete(
          `${apiUrl}/hearing/${hearingId}/defendants/${defendantId}/notes/draft`
        )
      } catch (e) {
        if (e.response?.status === 404) {
          return // if the note draft has never been saved, delete would return 404 which we should be ignoring it.
        }
        throw e
      }
    },
    addHearingOutcome: async (hearingId, defendantId, hearingOutcomeType) =>
      await update(`${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/outcome`, {
        hearingOutcomeType
      }),
    assignHearingOutcome: async (hearingId, defendantId, assignedTo) => {
      await update(`${apiUrl}/hearing/${hearingId}/defendant/${defendantId}/outcome/assign`, {
        assignedTo
      })
    },
    saveDraftCaseComment: async (caseId, defendantId, comment, author) =>
      await update(`${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/draft`, {
        caseId,
        comment,
        author
      }),
    deleteCaseCommentDraft: async (caseId, defendantId) => {
      try {
        await httpDelete(`${apiUrl}/cases/${caseId}/defendants/${defendantId}/comments/draft`)
      } catch (e) {
        if (e.response?.status === 404) {
          return // if the comment draft has never been saved, delete would return 404 which we should be ignoring it.
        }
        throw e
      }
    },
    getOutcomeTypes: async () => {
      const res = await request(`${apiUrl}/hearing-outcome-types`)
      if (!isHttpSuccess(res)) {
        return getInternalServerErrorResponse(res)
      }
      return res.data
    }
  }
}

const defaultService = createCaseService(config.apis.courtCaseService.url)

module.exports = {
  ...defaultService,
  createCaseService
}
