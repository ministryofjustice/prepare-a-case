Feature: Privacy notice
  In order to understand how privacy and personal data are managed in the service
  As an authenticated user
  I want to be able to access the privacy notice within the service

  Scenario: View the privacy notice
    Given I am an authenticated user
    When I open the application
    Then I should see footer link "Privacy policy" with href "https://probation-frontend-components-dev.hmpps.service.justice.gov.uk/privacy-policy"
    And There should be no a11y violations
