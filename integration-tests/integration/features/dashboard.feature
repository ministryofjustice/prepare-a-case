Feature: Dashboard
  In order to view a simplified overview of the day in court
  As an authenticated user
  I want to see a dashboard view

  Scenario: View the dashboard
    Given I am an authenticated user
    When I open the application
    Then I should be on the "Dashboard" page
    And There should be no a11y violations
