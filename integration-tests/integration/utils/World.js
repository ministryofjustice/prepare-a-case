/* global Cypress */
export default class World {

  state = {
    local: {
      caseSummary: {
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
      }
    },
    dev: {
      caseSummary: {
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

  constructor () {
    const self = this
    self.environment = Cypress.env('ENVIRONMENT')
    self.scenario = 'notKnownDefendant'
    self.data = new Proxy(self.state, {
      get: (obj, prop) => {
        return obj[self.environment].caseSummary[self.scenario][prop]
      }
    })
  }
}
