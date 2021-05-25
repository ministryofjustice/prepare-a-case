Feature: Privacy notice
  In order to understand how privacy and personal data are managed in the service
  As an authenticated user
  I want to be able to access the privacy notice within the service

  Scenario: View the privacy notice
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Privacy" with href "/privacy-notice"
    And I navigate to the "/privacy-notice" base route

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"

    Then I should see the heading "Privacy notice"
    And There should be no a11y violations
