Feature: Case list
  In order to view the list of cases sitting on the day in court
  As a registered user
  I want to see a case list view

  Scenario: View the case list
    Given I am a registered user
    When I open the application
    When I navigate to the "case-list" route
    Then I should be on the "Case list" page
