Feature: Accessibility statement
  In order to understand how to use the accessibility features of Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a accessibility statement within the service

  Scenario: View the accessibility statement page
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Accessibility statement" with href "/accessibility-statement"
    And I navigate to the "/accessibility-statement" base route
    Then I should see the heading "Accessibility statement"
    And There should be no a11y violations