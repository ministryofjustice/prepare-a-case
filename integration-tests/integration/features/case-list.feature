Feature: Cases
  In order to view the list of cases sitting on the day in court
  As a registered user
  I want to see a case list view

  Scenario: View the case list
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And There should be no a11y violations
    And I should see sub navigation with three dates
    And I should see a table with correct headings
