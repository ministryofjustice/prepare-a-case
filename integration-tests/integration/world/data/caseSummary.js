const caseSummaryTestData = {
  caseSummary: {
    local: {
      notKnownDefendant: {
        caseNo: 8678951874,
        pnc: 'A/1234560BA',
        name: 'Kara Ayers',
        dateOfBirth: '31st October 1980',
        offence: 'Assault by beating',
        offenceDetails: 'On 01/01/2016 at Newcastle assaulted Short Pearson by beating him.',
        offenceCaption: 'Contrary to section 39 of the Criminal Justice Act 1988.'
      },
      previouslyKnownDefendant: {},
      currentDefendant: {},
      currentDefendantWithBreach: {
        caseNo: 6627839278,
        name: 'Webb Mitchell'
      }
    },
    dev: {
      notKnownDefendant: {},
      previouslyKnownDefendant: {},
      currentDefendant: {},
      currentDefendantWithBreach: {
        caseNo: 1585562016194,
        name: 'Mr Joe JMBBLOGGS'
      }
    }
  }
}

module.exports = {
  caseSummaryTestData
}
