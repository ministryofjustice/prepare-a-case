Feature: What's new
  In order to understand the new features of Prepare a case for sentence service
  As an authenticated user
  I want to be able to access information about the new features within the service

  Scenario: View the What's new page
    Given I am an authenticated user
    When I open the application
    And I should see footer link "What's new" with href "/whats-new"
    And I navigate to the "/whats-new" base route

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"
    And I should see phase banner link "report a bug" with href "https://docs.google.com/forms/d/e/1FAIpQLSfLqoIFzPIivFNJwCvQPcw6L_fUkbTY6RNqgzrIpN4XGKBqpA/viewform?pli=1"
    And I should see back link "Back" with href "/"

    Then I should see the heading "What's new"
    And I should see the following level 2 headings
      | 8 February 2024 |
      | 25 August 2023  |
      | 27 July 2023    |
      | 7 February 2023 |
      | 24 January 2023 |
    And I should see the following level 3 headings
      | View case lists earlier                       |
      | New filters on the case list                  |
      | Speed improvements                            |
      | Search for a defendant                        |
      | Add comments to a case                        |
      | View cases in the past and see a case history |
      | Checking for missing PSR statuses             |
      | How to find reports in Court Diary            |
    And I should see footer link "What's new" with href "/whats-new"

    And There should be no a11y violations
