Feature: Cases
  In order to view the list of cases sitting on the day in court
  As a registered user
  I want to see a case list view

  Scenario: View the case list with data for the given day
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And There should be no a11y violations
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant        | Probation record | Offence                                        | Listing     | Session   | Court |
      | JCONE            | Not known        | Theft from a shop                              | 1st listing | Morning   | 1     |
      | Mr Joe JMBBLOGGS | Not known        | Use a television set without a licence         | 2nd listing | Morning   | 1     |
      | MR TEST OLLIEONE | Not known        | Caused to be published a tobacco advertisement | 1st listing | Morning   | 2     |
      | MR TEST OLLIETWO | Not known        | Attempt theft from the person of another       | 1st listing | Afternoon | 2     |
      | DLFOUR           | Not known        | Theft from a shop                              | 1st listing | Afternoon | 3     |
    And The following defendant names should be links
      | JCONE | Mr Joe JMBBLOGGS | MR TEST OLLIEONE | MR TEST OLLIETWO | DLFOUR |

  Scenario: View the case list with no data for the given day
    Given I am a registered user
    When I navigate to the "cases/20200101" route
    Then I should be on the "Cases" page
    And There should be no a11y violations
    And I should not see the table list
    And I should see the body text "No case data available for today."

