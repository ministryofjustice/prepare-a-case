Feature: User guide
  In order to understand how to use the Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a user guide within the service

  Scenario: View the user guide page
    Given I am an authenticated user
    When I open the application
    And I navigate to the "cases" route for today
    Then I should see link "View user guide" with href "https://justiceuk.sharepoint.com/sites/HMPPS_Group_CSA/"
    And There should be no a11y violations
