Feature: Ping
  In order to determine that the UI application is running
  I want to be able to hit a /ping endpoint

  Scenario: Ping the application
    When I open the application
    When I navigate to the "ping" route
    Then I should see the text "up"