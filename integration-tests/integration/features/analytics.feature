Feature: Application Insights snippet inclusion
  Scenario: Verify that the Application Insights snippet is included on the web page
    Given I am an authenticated user
    When I open the application
    Then the "appInsights" object should be defined on the window
    And the "appInsights" object should have properties and methods
      | property/method name   |
      | trackEvent             |
      | trackException         |
      | trackPageView          |
      