Feature: Cases
  In order to view the list of cases sitting on the day in court
  As a registered user
  I want to see a case list view

  Scenario: View the case list with data for the given day
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And There should be no a11y violations
    And I should see sub navigation with three dates
    And I should see a table with specific headings
    And I should see a list of defendants

  Scenario: View the case list with no data for the given day
    Given I am a registered user
    When I navigate to the "cases/2020-01-01" route
    Then I should be on the "Cases" page
    And There should be no a11y violations
    And I should not see a table list
    And I should see the body text "No case data available for today."

