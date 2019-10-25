Feature: Dashboard
  In order to view a simplified overview of the day in court
  As a registered user
  I want to see a dashboard view

  Scenario: View the dashboard
    Given I am a registered user
    When I open the application
    Then I should be on the "Dashboard" page

