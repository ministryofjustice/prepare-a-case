Feature: Cases
  In order to view the list of cases sitting on the day in court
  As a registered user
  I want to see a case list view

  Scenario: View the case list with data for the given day
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant        | Probation status | Offence                                        | Listing | Session   | Court |
      | JCONE            | No record        | Theft from a shop                              | 1st     | Morning   | 1     |
      | Mr Joe JMBBLOGGS | No record        | Use a television set without a licence         | 2nd     | Morning   | 1     |
      | MR TEST OLLIEONE | Previously known | Caused to be published a tobacco advertisement | 1st     | Morning   | 2     |
      | MR TEST OLLIETWO | Current          | Attempt theft from the person of another       | 1st     | Afternoon | 2     |
      | DLFOUR           | No record        | Theft from a shop                              | 1st     | Afternoon | 3     |
    And The following defendant names should be links
      | JCONE | Mr Joe JMBBLOGGS | MR TEST OLLIEONE | MR TEST OLLIETWO | DLFOUR |
    And There should be no a11y violations

  Scenario: View the case list with no data for the given day
    Given I am a registered user
    When I navigate to the "cases/2020-01-01" route
    Then I should be on the "Cases" page
    And I should see the caption "Sheffield Magistrates' Court"
    And I should not see the table list
    And I should see the body text "No case data available for this day."
    And There should be no a11y violations

Scenario: A user needs to know when the data in the list was created (as a proxy to know how reliable it is)
    Given I am a registered user
    When I view the court list
    Then Display “last updated” time with a timestamp of the most recent Libra data