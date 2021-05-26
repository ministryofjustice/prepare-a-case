Feature: Case list
  In order to view the list of cases sitting on the day in court
  As an authenticated user
  I want to see a case list view

  Scenario: View the case list with data containing 207 cases for the given day
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"

    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And I should see the current day as "Today"
    And I should see 7 days navigation bar

    And I should see link "Review defendants with possible NDelius records" with href "/B14LO/match/bulk/"
    And I should see the matching inset text "2 defendants partially match existing records and need review"

    And I should see a tab with text "Case list"
    And I should see a tab with text "Recently added (4)"
    And I should see a tab with text "Removed cases (1)"

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers   | No record | Attempt theft from the person of another | 1st | Morning | 10 |
      | Mann Carroll | Pre-sentence record | Assault by beating             | 3rd | Morning | 2  |

    And I should see link "Kara Ayers" with href "/B14LO/case/8678951874/summary"
    And I should see link "Mann Carroll" with href "/B14LO/case/7483843110/summary"

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
    Given I am an authenticated user
    When I navigate to the "cases" route for today

    Then I should be on the "Case list" page

    # Repeat some tests to ensure UI is consistent on subsequent pages
    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And I should see the current day as "Today"
    And I should see 7 days navigation bar

    And I should see link "Review defendants with possible NDelius records" with href "/B14LO/match/bulk/"
    And I should see the matching inset text "2 defendants partially match existing records and need review"

    And I should see a tab with text "Case list"
    And I should see a tab with text "Recently added (4)"
    And I should see a tab with text "Removed cases (1)"

    And I should see a count of "207 cases"

    When I click pagination link "2"

    Then I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Robert Hardin | No record | Attempt theft from the person of another | 3rd | Morning | 3 |
      | Vance Landry  | No record | Theft from the person of another         | 3rd | Morning | 3 |

    And I should see link "Robert Hardin" with href "/B14LO/case/3698624753/summary"
    And I should see link "Vance Landry" with href "/B14LO/case/8339335977/summary"

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
    And There should be no a11y violations

  Scenario: View the case list with data containing 207 cases for the given day and navigate to page 3
    Given I am an authenticated user

    # Move to Monday 4th Jan 2021 so that we can ensure pagination still functions correctly
    When I navigate to the "cases/2021-01-04" route

    Then I should be on the "Case list" page
    And I should see the URL with "cases/2021-01-04"

    And I click pagination link "3"
    Then I should see the URL with "cases/2021-01-04?page=3"

    Then I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Amanda McKay   | Current   | Theft from the person of another         | 3rd | Morning | 1 |
      | Perry Delacruz | No record | Attempt theft from the person of another | 1st | Morning | 1 |

    And I should see link "Amanda McKay" with href "/B14LO/case/7259057874/summary"
    And I should see link "Perry Delacruz" with href "/B14LO/case/4956910657/summary"

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
    And There should be no a11y violations

  Scenario: View the case list with data containing 207 cases for the given day and navigate to page 5
    Given I am an authenticated user
    When I navigate to the "cases" route for today

    Then I should be on the "Case list" page

    When I click pagination link "5"

    Then I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Leticia Santana | Previously known | Assault by beating                       | 3rd | Morning | 8 |
      | Maribel Camacho | Previously known | Attempt theft from the person of another | 1st | Morning | 6 |

    And I should see link "Leticia Santana" with href "/B14LO/case/198802204/summary"
    And I should see link "Maribel Camacho" with href "/B14LO/case/5622691303/summary"

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
    And There should be no a11y violations

  Scenario: View the case list with data containing 207 cases for the given day and navigate to page 11
    Given I am an authenticated user
    When I navigate to the "cases" route for today

    Then I should be on the "Case list" page

    When I click pagination link "5"
    And I click pagination link "7"
    And I click pagination link "9"
    And I click pagination link "11"

    Then I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Luisa Alston      | No record        | Theft from a shop                | 3rd | Afternoon | 3 |
      | Macdonald Ellison | Previously known | Theft from the person of another | 3rd | Afternoon | 4 |

    And I should see link "Luisa Alston" with href "/B14LO/case/8618449819/summary"
    And I should see link "Macdonald Ellison" with href "/B14LO/case/5935205489/summary"

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
    And There should be no a11y violations

  Scenario: View the recently added cases on the case list
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    When I click the "Recently added (4)" link
    Then I should be on the "Recently added cases" page

    Then I should see medium heading with text "4 cases added to today's case list."

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Sara Ortega   | Previously known | Assault by beating | 3rd | Morning | 3 |
      | Obrien McCall | No record        | Theft from a shop  | 2nd | Morning | 8 |

    And I should see link "Sara Ortega" with href "/B14LO/case/2980462628/summary"
    And I should see link "Obrien McCall" with href "/B14LO/case/649174512/summary"

    And I should not see pagination
    And I should not see filters
    And There should be no a11y violations

    # Test state held in session
    When I navigate to the "cases" route
    Then I should be on the "Recently added cases" page
    And I should see medium heading with text "4 cases added to today's case list."

  Scenario: View the removed cases on the case list
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    When I click the "Removed cases (1)" link
    Then I should be on the "Removed cases" page

    Then I should see medium heading with text "1 case removed from today's case list."

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court | Libra case number |

    And I should see the following table rows
      | Geoff McTaggart | No record | Assault by beating | 3rd | Afternoon | 1 | 7483843114 |

    And I should see link "Geoff McTaggart" with href "/B14LO/case/7483843114/summary"

    And I should not see pagination
    And I should not see filters
    And There should be no a11y violations

    # Test state held in session
    When I navigate to the "cases" route
    Then I should be on the "Removed cases" page
    And I should see medium heading with text "1 case removed from today's case list."

  Scenario: View the case list with data containing 5 cases for the given day
    Given I am an authenticated user

    When I navigate to the "cases/2020-01-02" route
    Then I should be on the "Case list" page
    And I should see the current day as "Thursday 2 January"
    And I should not see 7 days navigation bar
    And I should see link "Go to today" with href "/cases"

    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And I should not see that any defendants have possible NDelius records

    And I should see a count of "5 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Gill Arnold    | Current          | Theft from the person of another | 3rd | Morning | 1 |
      | Cornelia McCoy | Previously known | Assault by beating               | 2nd | Morning | 1 |

    And I should see link "Gill Arnold" with href "/B14LO/case/1474726180/summary"
    And I should see link "Cornelia McCoy" with href "/B14LO/case/4071719588/summary"

    And I should not see pagination
    And There should be no a11y violations

  Scenario: View the case list with no data for the given day
    Given I am an authenticated user

    When I navigate to the "cases/2020-01-01" route
    Then I should be on the "Case list" page
    And I should see the current day as "Wednesday 1 January"
    And I should not see 7 days navigation bar

    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And I should not see that any defendants have possible NDelius records

    And I should not see filters
    And I should not see the table list
    And I should see the body text "No case list information available."
    And I should not see pagination
    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Current offenders and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Apply filters" button

    Then I should see a count of "66 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Lenore Marquez | Current | Attempt theft from the person of another | 2nd | Morning | 6 |

    When I click the clear "Current" filter tag

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only court room 1 and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "cases" route
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    When I click the "Courtroom" filter button
    And I select the "01" filter
    And I click the "Apply filters" button

    Then I should see a count of "22 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Ruth Martin | Previously known | Theft from the person of another | 1st | Morning | 1 |

    When I click the clear "1" filter tag

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only the afternoon session and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    When I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Apply filters" button

    Then I should see a count of "6 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Charlene Hammond | Previously known | Theft from the person of another | 3rd | Afternoon | 10 |

    When I click the clear "Afternoon" filter tag

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Current offenders in courtroom 1 during the afternoon session and quickly clear the selections
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Courtroom" filter button
    And I select the "01" filter
    And I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Apply filters" button

    Then I should see a count of "1 case"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Porter Salas | Current | Theft from the person of another | 2nd | Afternoon | 1 |

    When I click the "Clear all" link

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Pre-sentence record offenders and quickly clear the selections
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    When I click the "Probation status" filter button
    And I select the "Pre-sentence record" filter
    And I click the "Apply filters" button

    Then I should see a count of "1 case"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Mann Carroll | Pre-sentence record | Assault by beating | 3rd | Morning | 2 |


    When I click the "Clear all" link

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    And There should be no a11y violations

  Scenario: Display no matching cases message when no cases are returned due to applied filters
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | 10 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Courtroom" filter button
    And I select the "06" filter
    And I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Apply filters" button

    And I should see a count of "0 cases"
    Then I should see the body text "There are no matching cases."
    And There should be no a11y violations
