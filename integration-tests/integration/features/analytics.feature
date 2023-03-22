Feature: Application Insights snippet inclusion
  Scenario: Verify that the Application Insights snippet is included on the web page
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner
    When I open the application
    Then the "appInsights" object should be defined on the window
    And the "appInsights" object should have properties and methods
      | trackEvent             |
      | trackException         |
      | trackPageView          |
