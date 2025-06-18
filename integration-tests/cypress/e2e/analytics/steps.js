import { Then } from '@badeball/cypress-cucumber-preprocessor'
import process from 'process'

Then('the "appInsights" object should be defined on the window', function () {
  if (process?.env.TEST_APPINSIGHTS_ENABLE) {
    cy.window().should('have.property', 'appInsights')
  }
})

Then('the "appInsights" object should have properties and methods', function ($data) {
  if (process?.env.TEST_APPINSIGHTS_ENABLE) {
    $data.raw().forEach((dataRow) => {
      cy.window().its('appInsights').should('have.property', dataRow[0])
    })
  }
})

Then('the "ClickAnalytics" plugin should be initialized', function () {
  if (process?.env.ENABLE_CLICK_ANALYTICS) {
    cy.window().its('clickPluginInstance.isInitialized').then(isInitialized => {
      expect(isInitialized()).to.be.true
    })
  }
})
