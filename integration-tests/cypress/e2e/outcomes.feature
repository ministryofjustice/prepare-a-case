Feature: Outcomes List
  In order to view the list of outcomes
  As an authenticated user
  I want to click on the Outcomes link in the Primary navigation
  So that I can go to the Outcomes page.
  
  Scenario: Clicking on the Outcomes link should take me to the Outcomes page
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And I should see the Primary navigation
    And I should see the Primary navigation "Outcomes" link
    When I click on the "Outcomes" link in the Primary navigation
    Then I should be on the "Hearing outcomes" page
    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"
    And I should see phase banner link "report a bug" with href "https://docs.google.com/forms/d/e/1FAIpQLSfLqoIFzPIivFNJwCvQPcw6L_fUkbTY6RNqgzrIpN4XGKBqpA/viewform?pli=1"
    And I should see a tab with text "Cases to result"
    And I should see a tab with text "In progress"
    And I should see a tab with text "Resulted cases"

  Scenario: View the In progress tab on the Outcomes page
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I click the "In progress" link
    Then I should see the URL with "in-progress"

 Scenario: View the Resulted Cases tab on the Outcomes page
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I click the "Resulted cases" link
    Then I should see the URL with "resulted-cases"

  Scenario: Should be able to see and navigate to hearing outcomes from case summary page
    Given I am an authenticated user
    When I navigate to the "cases" route
    Then I should be on the "Case list" page
    When I click the "English Madden" link
    And I should see the Primary navigation "Outcomes" link
    When I click on the "Outcomes" link in the Primary navigation
    Then I should be on the "Hearing outcomes" page
    And There should be no a11y violations