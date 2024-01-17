Feature: Accessibility statement
  In order to understand how to use the accessibility features of Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a accessibility statement within the service

  Scenario: View the accessibility statement page
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Accessibility statement" with href "/accessibility-statement"
    And I navigate to the "/accessibility-statement" base route

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"
    And I should see phase banner link "report a bug" with href "https://docs.google.com/forms/d/e/1FAIpQLSfLqoIFzPIivFNJwCvQPcw6L_fUkbTY6RNqgzrIpN4XGKBqpA/viewform?pli=1"

    Then I should see the heading "Accessibility statement"
    And There should be no a11y violations
