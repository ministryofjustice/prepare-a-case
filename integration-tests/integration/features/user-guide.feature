Feature: User guide
  In order to understand how to use the Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a user guide within the service

  Scenario: View the user guide page
    Given I am an authenticated user
    When I open the application
    And I navigate to the "/user-guide" base route
    Then I should see the heading "User guide"
    And I should see link "Overview" with href "#ug-overview"
    And I should see footer link "User guide" with href "/user-guide"
    And There should be no a11y violations
    When I switch to mobile view
    Then Link with text "Overview" should not be visible
    And There should be no a11y violations
