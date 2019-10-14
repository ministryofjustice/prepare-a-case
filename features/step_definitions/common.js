const { Given, When, Then } = require('cucumber')
const { openApp, navigateToPage, shouldBeOnPage, shouldSeeText } = require('../support/actions')

Given('I am a registered user', () => {
  // @TODO: Implement registered user test
  return true
})

When('I open the application', openApp)

When('I navigate to the {string} route', string => navigateToPage(string))

Then('I should be on the {string} page', string => shouldBeOnPage(string))

Then('I should see the text {string}', string => shouldSeeText(string))
