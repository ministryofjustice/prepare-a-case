import { notKnownDefendant } from './case-summary/notKnownDefendant'
import { previouslyKnownDefendant } from './case-summary/previouslyKnownDefendant'
import { currentDefendant } from './case-summary/currentDefendant'
import { currentDefendantWithBreach } from './case-summary/currentDefendantWithBreach'
import notMatchedDefendant from './case-summary/notMatchedDefendant'

const caseSummaryTestData = {
  caseSummary: {
    notMatchedDefendant: {
      ...notMatchedDefendant
    },
    notKnownDefendant: {
      ...notKnownDefendant
    },
    previouslyKnownDefendant: {
      ...previouslyKnownDefendant
    },
    currentDefendant: {
      ...currentDefendant
    },
    currentDefendantWithBreach: {
      ...currentDefendantWithBreach
    }
  }
}

module.exports = {
  caseSummaryTestData
}
