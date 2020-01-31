Feature: Cases
  In order to view the list of cases sitting on the day in court
  As a registered user
  I want to see a case list view

  Scenario: View the case list with data containing 11 cases for the given day
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
    And I should see pagination
    And I should not see pagination link "Previous"
    And I should not see pagination link "1"
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "?page=2"
    And I should see pagination link "3" with href "?page=3"
    And I should see pagination link "Next" with href "?page=2"
    And I should see pagination text "Showing 1 to 5 of 11 results"
    And There should be no a11y violations

  Scenario: View the case list with data containing 11 cases for the given day and navigate to page 2
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I click pagination link "2"
    Then I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant          | Probation status | Offence                                        | Listing | Session   | Court |
      | JMBONE             | No record        | Theft from a shop                              | 1st     | Afternoon | 3     |
      | JMBTWO             | No record        | Theft from a shop                              | 1st     | Afternoon | 1     |
      | JMBTHREE           | No record        | Use a television set without a licence         | 2nd     | Afternoon | 1     |
      | mr terry TESTING   | Previously known | Caused to be published a tobacco advertisement | 1st     | Afternoon | 2     |
      | mr DARREN DRINKING | Current          | Attempt theft from the person of another       | 1st     | Afternoon | 2     |
    And The following defendant names should be links
      | JMBONE | JMBTWO | JMBTHREE | mr terry TESTING | mr DARREN DRINKING |
    And I should see pagination
    And I should see pagination link "Previous" with href "?page=1"
    And I should see pagination link "1" with href "?page=1"
    And I should not see pagination link "2"
    And I should see pagination page "2" highlighted
    And I should see pagination link "3" with href "?page=3"
    And I should see pagination link "Next" with href "?page=3"
    And I should see pagination text "Showing 6 to 10 of 11 results"

  Scenario: View the case list with data containing 11 cases for the given day and navigate to page 3
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I click pagination link "3"
    Then I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant        | Probation status | Offence           | Listing | Session   | Court |
      | Mr FOUR SUSPSPRO | No record        | Theft from a shop | 1st     | Afternoon | 3     |
    And The following defendant names should be links
      | Mr FOUR SUSPSPRO |
    And I should see pagination
    And I should see pagination link "Previous" with href "?page=2"
    And I should see pagination link "1" with href "?page=1"
    And I should see pagination link "2" with href "?page=2"
    And I should not see pagination link "3"
    And I should see pagination page "3" highlighted
    And I should not see pagination link "Next"
    And I should see pagination text "Showing 11 to 11 of 11 results"

  Scenario: View the case list with data containing 5 cases for the given day
    Given I am a registered user
    When I navigate to the "cases/2020-01-02" route
    Then I should be on the "Cases" page
    And I should see the caption "Sheffield Magistrates' Court"
    And I should see the following table
      | Defendant        | Probation status | Offence                                        | Listing | Session   | Court |
      | JCONE            | No record        | Theft from a shop                              | 1st     | Morning   | 1     |
      | Mr Joe JMBBLOGGS | No record        | Use a television set without a licence         | 2nd     | Morning   | 1     |
      | MR TEST OLLIEONE | Previously known | Caused to be published a tobacco advertisement | 1st     | Morning   | 2     |
      | MR TEST OLLIETWO | Current          | Attempt theft from the person of another       | 1st     | Afternoon | 2     |
      | DLFOUR           | No record        | Theft from a shop                              | 1st     | Afternoon | 3     |
    And The following defendant names should be links
      | JCONE | Mr Joe JMBBLOGGS | MR TEST OLLIEONE | MR TEST OLLIETWO | DLFOUR |
    And I should not see pagination
    And There should be no a11y violations

  Scenario: View the case list with no data for the given day
    Given I am a registered user
    When I navigate to the "cases/2020-01-01" route
    Then I should be on the "Cases" page
    And I should see the caption "Sheffield Magistrates' Court"
    And I should not see the table list
    And I should see the body text "No case data available for this day."
    And I should not see pagination
    And There should be no a11y violations

Scenario: A user needs to know when the data in the list was created (as a proxy to know how reliable it is)
    Given I am a registered user
    When I view the court list
    Then Display “last updated” time with a timestamp of the most recent Libra data