Feature: Cookies policy
  In order to understand how the cookies are used in Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a cookies policy page within the service

  Scenario: View the cookies policy page
    Given I am an authenticated user
    When I open the application
    Then I should see footer link "Cookies policy" with href "https://probation-frontend-components-dev.hmpps.service.justice.gov.uk/cookies-policy"
    And There should be no a11y violations
