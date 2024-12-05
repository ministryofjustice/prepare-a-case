Feature: Application Insights snippet inclusion
  Scenario: Verify that the Application Insights snippet is included on the web page
    Given I am an authenticated user
    When I open the application
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner
    And the "appInsights" object should be defined on the window
    And the "appInsights" object should have properties and methods
      | trackEvent             |
      | trackException         |
      | trackPageView          |
  Scenario: Verify that the Click Analytics plugin is included on the web page and loaded
    Given I am an authenticated user
    When I open the application
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner
    And the "ClickAnalytics" plugin should be initialized