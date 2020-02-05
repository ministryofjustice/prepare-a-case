Feature: Cases
  In order to view the list of cases sitting on the day in court
  As a registered user
  I want to see a case list view

  Scenario: View the case list with data containing 207 cases for the given day
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant       | Probation status | Offence                          | Listing | Session | Court |
      | Jonathan Moss   | Previously known | Theft from the person of another | 1st     | Morning | 4     |
      | Beth Rasmussen  | Previously known | Assault by beating               | 3rd     | Morning | 6     |
      | Penelope Brewer | Current          | Theft from a shop                | 3rd     | Morning | 4     |
    And The following defendant names should be links
      | Jonathan Moss | Beth Rasmussen | Penelope Brewer |
    And I should see pagination
    And I should not see pagination link "Previous"
    And I should not see pagination link "1"
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "?page=2"
    And I should see pagination link "3" with href "?page=3"
    And I should see pagination link "Next" with href "?page=2"
    And I should see pagination text "Showing 1 to 20 of 207 results"
    And There should be no a11y violations

  Scenario: View the case list with data containing 207 cases for the given day and navigate to page 2
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I click pagination link "2"
    Then I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant        | Probation status | Offence                                  | Listing | Session | Court |
      | Annabelle Lowery | Current          | Theft from the person of another         | 2nd     | Morning | 8     |
      | Matilda Cummings | Previously known | Attempt theft from the person of another | 1st     | Morning | 5     |
      | Marian Alvarez   | Previously known | Theft from a shop                        | 1st     | Morning | 10    |
    And The following defendant names should be links
      | Annabelle Lowery | Matilda Cummings | Marian Alvarez |
    And I should see pagination
    And I should see pagination link "Previous" with href "?page=1"
    And I should see pagination link "1" with href "?page=1"
    And I should not see pagination link "2"
    And I should see pagination page "2" highlighted
    And I should see pagination link "3" with href "?page=3"
    And I should see pagination link "4" with href "?page=4"
    And I should see pagination link "5" with href "?page=5"
    And I should see pagination link "Next" with href "?page=3"
    And I should see pagination text "Showing 21 to 40 of 207 results"

  Scenario: View the case list with data containing 207 cases for the given day and navigate to page 3
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I click pagination link "3"
    Then I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant        | Probation status | Offence                          | Listing | Session | Court |
      | Judy Stuart      | No record        | Theft from the person of another | 1st     | Morning | 3     |
      | Anastasia Willis | Current          | Assault by beating               | 2nd     | Morning | 3     |
      | Sparks Strong    | Current          | Assault by beating               | 3rd     | Morning | 2     |
    And The following defendant names should be links
      | Judy Stuart | Anastasia Willis | Sparks Strong |
    And I should see pagination
    And I should see pagination link "Previous" with href "?page=2"
    And I should see pagination link "1" with href "?page=1"
    And I should see pagination link "2" with href "?page=2"
    And I should not see pagination link "3"
    And I should see pagination page "3" highlighted
    And I should see pagination link "4" with href "?page=4"
    And I should see pagination link "5" with href "?page=5"
    And I should see pagination link "Next" with href "?page=4"
    And I should see pagination text "Showing 41 to 60 of 207 results"

  Scenario: View the case list with data containing 207 cases for the given day and navigate to page 5
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I click pagination link "5"
    Then I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant       | Probation status | Offence                                  | Listing | Session | Court |
      | Ladonna English | No record        | Assault by beating                       | 2nd     | Morning | 8     |
      | Rojas Bonner    | Previously known | Attempt theft from the person of another | 3rd     | Morning | 1     |
      | Carney Solomon  | Previously known | Theft from the person of another         | 1st     | Morning | 8     |
    And The following defendant names should be links
      | Ladonna English | Rojas Bonner | Carney Solomon |
    And I should see pagination
    And I should see pagination link "Previous" with href "?page=4"
    And I should not see pagination link "1"
    And I should not see pagination link "2"
    And I should see pagination link "3" with href "?page=3"
    And I should see pagination link "4" with href "?page=4"
    And I should not see pagination link "5"
    And I should see pagination page "5" highlighted
    And I should see pagination link "6" with href "?page=6"
    And I should see pagination link "7" with href "?page=7"
    And I should not see pagination link "8"
    And I should not see pagination link "9"
    And I should not see pagination link "10"
    And I should not see pagination link "11"
    And I should see pagination link "Next" with href "?page=6"
    And I should see pagination text "Showing 81 to 100 of 207 results"

  Scenario: View the case list with data containing 207 cases for the given day and navigate to page 11
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I click pagination link "5"
    And I click pagination link "7"
    And I click pagination link "9"
    And I click pagination link "11"
    Then I should see the caption "Sheffield Magistrates' Court"
    And I should see sub navigation with default dates
    And I should see the following table
      | Defendant      | Probation status | Offence                                  | Listing | Session   | Court |
      | Ortiz Lane     | No record        | Theft from the person of another         | 1st     | Afternoon | 2     |
      | Mavis Hamilton | Previously known | Theft from the person of another         | 1st     | Afternoon | 2     |
      | Bright Maynard | No record        | Attempt theft from the person of another | 1st     | Afternoon | 10    |
    And The following defendant names should be links
      | Ortiz Lane | Mavis Hamilton | Bright Maynard |
    And I should see pagination
    And I should see pagination link "Previous" with href "?page=10"
    And I should see pagination link "7" with href "?page=7"
    And I should see pagination link "8" with href "?page=8"
    And I should see pagination link "9" with href "?page=9"
    And I should see pagination link "10" with href "?page=10"
    And I should not see pagination link "11"
    And I should see pagination page "11" highlighted
    And I should not see pagination link "Next"
    And I should see pagination text "Showing 201 to 207 of 207 results"

  Scenario: View the case list with data containing 5 cases for the given day
    Given I am a registered user
    When I navigate to the "cases/2020-01-02" route
    Then I should be on the "Cases" page
    And I should see the caption "Sheffield Magistrates' Court"
    And I should see the following table
      | Defendant       | Probation status | Offence                          | Listing | Session | Court |
      | Jonathan Moss   | Previously known | Theft from the person of another | 1st     | Morning | 4     |
      | Beth Rasmussen  | Previously known | Assault by beating               | 3rd     | Morning | 6     |
      | Penelope Brewer | Current          | Theft from a shop                | 3rd     | Morning | 4     |
      | Monique Griffin | Previously known | Assault by beating               | 2nd     | Morning | 4     |
      | Melody Abbott   | No record        | Assault by beating               | 3rd     | Morning | 7     |
    And The following defendant names should be links
      | Jonathan Moss | Beth Rasmussen | Penelope Brewer | Monique Griffin | Melody Abbott |
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