const caseSummaryTestData = {
  caseSummary: {
    local: {
      notKnownDefendant: {
        caseNo: 8678951874,
        name: 'Kara Ayers'
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
