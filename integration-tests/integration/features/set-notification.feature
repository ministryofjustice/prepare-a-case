Feature: Set Notification
  In order to display a notification to users
  As an authenticated user
  I want to be able to set a notification within the application

  Scenario: View the set notification page
    Given I am an authenticated user
    When I navigate to the "/set-notification" protected route

    And There should be no a11y violations
