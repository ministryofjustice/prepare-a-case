/* global Cypress */
const { caseSummaryTestData } = require('./data/caseSummary')

export default class World {
  constructor (section) {
    this.testData = {
      ...caseSummaryTestData
    }
    this.section = section || ''
    this.scenario = ''
    this.environment = Cypress.env('ENVIRONMENT') || 'local'
    this.data = new Proxy(this, {
      get: (world, prop) => {
        if (world.section === '' || world.scenario === '') {
          throw new Error('Section and scenario must be set')
        }
        return world.testData[world.section][world.scenario][world.environment][prop]
      }
    })
  }
}
