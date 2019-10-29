Feature: Ping

  Scenario: Ping the application
    When I open the application
    When I navigate to the "ping" route
    Then I should see the text "pong"