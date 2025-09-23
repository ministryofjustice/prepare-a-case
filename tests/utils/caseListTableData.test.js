/* global describe, it, expect */
const caseListTableData = require('../../server/utils/caseListTableData.js')

describe('caseListTableData', () => {
  describe('getBadge', () => {
    it('should get notMatched badge', () => {
      const badge = caseListTableData.getBadge(
        {
          awaitingPsr: false,
          breach: false,
          suspendedSentenceOrder: false
        }, true)

      expect(badge).toEqual('<div><span class="moj-badge moj-badge--red pac-badge">Possible NDelius Record</span></div>')
    })

    it('should get awaiting PSR badge', () => {
      const badge = caseListTableData.getBadge(
        {
          awaitingPsr: true,
          breach: false,
          suspendedSentenceOrder: false
        }, false)

      expect(badge).toEqual('<div><span class="moj-badge moj-badge--black pac-badge">PSR</span></div>')
    })

    it('should get breach badge', () => {
      const badge = caseListTableData.getBadge(
        {
          awaitingPsr: false,
          breach: true,
          suspendedSentenceOrder: false
        }, false)

      expect(badge).toEqual('<div><span class="moj-badge moj-badge--black pac-badge">Breach</span></div>')
    })

    it('should get suspendedSentenceOrder badge', () => {
      const badge = caseListTableData.getBadge(
        {
          awaitingPsr: false,
          breach: false,
          suspendedSentenceOrder: true
        }, false)

      expect(badge).toEqual('<div><span class="moj-badge moj-badge--black pac-badge">SSO</span></div>')
    })
  })

  describe('getProbationStatusHtml', () => {
    it('should have not matched', () => {
      const html = caseListTableData.getProbationStatusHtml(
        {
          probationStatus: 'Probation status'
        }, false
      )

      expect(html).toEqual('Probation status')
    })

    it('should have previously known', () => {
      const html = caseListTableData.getProbationStatusHtml(
        {
          probationStatus: 'Previously known',
          previouslyKnownTerminationDate: '1990-01-01'
        }, true
      )

      expect(html).toEqual('<div><span class="moj-badge moj-badge--red pac-badge">Possible NDelius Record</span></div>Previously known<span data-cy="previously-known-termination-date" class="govuk-caption-m">Order ended 1 January 1990</span>')
    })
  })

  describe('constructTableData', () => {
    const mockParams = {
      courtCode: 'TEST',
      subsection: '',
      workflow: {
        enabled: false
      }
    }

    const mockCase = {
      hearingId: 'hearing-123',
      defendantId: 'defendant-456',
      defendantName: 'John Smith',
      name: {
        forename1: 'John',
        surname: 'Smith'
      },
      crn: 'CRN123456',
      probationStatus: 'Current',
      courtRoom: '1',
      session: 'morning',
      listNo: 1,
      offences: [
        {
          offenceTitle: 'Theft from shop'
        }
      ],
      source: 'LIBRA'
    }

    it('should construct table data with correct headers', () => {
      const tableData = caseListTableData.constructTableData(mockParams, [])

      expect(tableData.head).toHaveLength(7)
      expect(tableData.head[0]).toEqual({ text: 'Defendant' })
      expect(tableData.head[1]).toEqual({ text: 'Probation status' })
      expect(tableData.head[2]).toEqual({ text: 'Offence' })
      expect(tableData.head[3]).toEqual({ text: 'Listing' })
      expect(tableData.head[4]).toEqual({ text: 'Session' })
      expect(tableData.head[5]).toEqual({ text: 'Court', format: 'numeric' })
      expect(tableData.head[6]).toEqual({ html: 'Action' })
    })

    it('should add case number header for removed subsection', () => {
      const paramsWithRemoved = { ...mockParams, subsection: 'removed' }
      const tableData = caseListTableData.constructTableData(paramsWithRemoved, [])

      expect(tableData.head).toHaveLength(8)
      expect(tableData.head[6]).toEqual({ text: 'Libra case number', format: 'numeric' })
      expect(tableData.head[7]).toEqual({ html: 'Action' })
    })

    it('should add workflow header when enabled', () => {
      const paramsWithWorkflow = {
        ...mockParams,
        workflow: {
          enabled: true,
          tasks: {
            prep: {
              items: []
            }
          }
        }
      }
      const tableData = caseListTableData.constructTableData(paramsWithWorkflow, [])

      expect(tableData.head).toHaveLength(8)
      expect(tableData.head[6]).toEqual({ html: 'Admin prep status' })
      expect(tableData.head[7]).toEqual({ html: 'Action' })
    })

    it('should construct table row with defendant data', () => {
      const tableData = caseListTableData.constructTableData(mockParams, [mockCase])

      expect(tableData.rows).toHaveLength(1)
      const row = tableData.rows[0]

      expect(row[0].html).toContain('John Smith')
      expect(row[0].html).toContain('CRN123456')
      expect(row[0].html).toContain(`/${mockParams.courtCode}/hearing/${mockCase.hearingId}/defendant/${mockCase.defendantId}/summary`)

      expect(row[1].html).toContain('Current')

      expect(row[2].html).toContain('Theft from shop')

      expect(row[3].html).toContain('1')

      expect(row[4].text).toBe('Morning')

      expect(row[5].text).toBe('1')
      expect(row[5].format).toBe('numeric')
    })

    it('should add action button with correct form action', () => {
      const tableData = caseListTableData.constructTableData(mockParams, [mockCase])
      const row = tableData.rows[0]
      const actionCell = row[row.length - 1]

      expect(actionCell.html).toContain('<form method="POST"')
      expect(actionCell.html).toContain(`action="/${mockParams.courtCode}/hearing/${mockCase.hearingId}/defendant/${mockCase.defendantId}/mark-outcome-not-required"`)
      expect(actionCell.html).toContain('Move to hearing outcome not required')
      expect(actionCell.html).toContain('govuk-button--secondary')
      expect(actionCell.html).toContain('type="submit"')
    })

    it('should handle multiple offences', () => {
      const caseWithMultipleOffences = {
        ...mockCase,
        offences: [
          { offenceTitle: 'Theft from shop' },
          { offenceTitle: 'Assault' }
        ]
      }

      const tableData = caseListTableData.constructTableData(mockParams, [caseWithMultipleOffences])
      const row = tableData.rows[0]

      expect(row[2].html).toContain('<ol class="govuk-list govuk-list--number govuk-!-margin-bottom-0">')
      expect(row[2].html).toContain('<li>Theft from shop</li>')
      expect(row[2].html).toContain('<li>Assault</li>')
    })

    it('should handle Common Platform source with list numbers', () => {
      const cpCase = {
        ...mockCase,
        source: 'COMMON_PLATFORM',
        offences: [
          { offenceTitle: 'Theft', listNo: 1 },
          { offenceTitle: 'Assault', listNo: 2 }
        ]
      }

      const tableData = caseListTableData.constructTableData(mockParams, [cpCase])
      const row = tableData.rows[0]

      expect(row[3].html).toContain('<ol class="govuk-list govuk-!-margin-bottom-0">')
      expect(row[3].html).toContain('<li>1st</li>')
      expect(row[3].html).toContain('<li>2nd</li>')
    })

    it('should add case number for removed subsection', () => {
      const paramsWithRemoved = { ...mockParams, subsection: 'removed' }
      const caseWithCaseNo = { ...mockCase, caseNo: '12345' }

      const tableData = caseListTableData.constructTableData(paramsWithRemoved, [caseWithCaseNo])
      const row = tableData.rows[0]

      expect(row[6].text).toBe('12345')
      expect(row[6].format).toBe('numeric')
      expect(row[7].html).toContain('mark-outcome-not-required') // Action button should be last
    })

    it('should construct multiple rows for multiple cases', () => {
      const cases = [
        mockCase,
        { ...mockCase, defendantId: 'defendant-789', defendantName: 'Jane Doe' }
      ]

      const tableData = caseListTableData.constructTableData(mockParams, cases)

      expect(tableData.rows).toHaveLength(2)
      expect(tableData.rows[0][6].html).toContain('defendant-456')
      expect(tableData.rows[1][6].html).toContain('defendant-789')
    })
  })
})
