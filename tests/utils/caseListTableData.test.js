/* global describe, it, expect, jest */
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

        it('should get awaitingPsr badge', () => {
            const badge = caseListTableData.getBadge(
                {
                    awaitingPsr: true,
                    breach: false,
                    suspendedSentenceOrder: false
                }, false)

            expect(badge).toEqual('<div><span class="moj-badge moj-badge--black pac-badge">Psr</span></div>')
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

            expect(badge).toEqual('<div><span class="moj-badge moj-badge--black pac-badge">Sso</span></div>')
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
});