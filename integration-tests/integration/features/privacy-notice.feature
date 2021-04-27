Feature: Privacy notice
  In order to understand how privacy and personal data are managed in the service
  As an authenticated user
  I want to be able to access the privacy notice within the service

  Scenario: View the privacy notice
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Privacy" with href "/privacy-notice"
    And I navigate to the "/privacy-notice" base route
    Then I should see the heading "Privacy notice"
    And There should be no a11y violations
