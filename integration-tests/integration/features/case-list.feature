Feature: Case list
  In order to view the list of cases sitting on the day in court
  As an authenticated user
  I want to see a case list view

  Scenario: View the case list with data containing 207 cases for the given day
    When I navigate to the "cases" route
    Given I am an authenticated user
    Then I should be on the "Cases" page
    And I am viewing the "unfilteredPage1" case list


    And I should see the heading "Cases"

    And I should see the caption with the relevant court
    And I should see sub navigation with default dates
    And I should see a timestamp of the most recent Libra data
    And I should see the case list table with headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And The defendant names should be links

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
    And I am viewing the "unfilteredPage2" case list

    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I click pagination link "2"

    Then I should see the caption with the relevant court
    And I should see sub navigation with default dates
    And I should see a timestamp of the most recent Libra data
    And I should see the case list table with headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And The defendant names should be links

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
    And I am viewing the "unfilteredPage3" case list

    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I click pagination link "3"

    Then I should see the caption with the relevant court
    And I should see sub navigation with default dates
    And I should see a timestamp of the most recent Libra data
    And I should see the case list table with headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And The defendant names should be links

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
    And I am viewing the "unfilteredPage5" case list

    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I click pagination link "5"

    Then I should see the caption with the relevant court
    And I should see sub navigation with default dates
    And I should see a timestamp of the most recent Libra data
    And I should see the case list table with headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And The defendant names should be links

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
    And I am viewing the "unfilteredPage11" case list

    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I click pagination link "5"
    And I click pagination link "7"
    And I click pagination link "9"
    And I click pagination link "11"

    Then I should see the caption with the relevant court
    And I should see sub navigation with default dates
    And I should see a timestamp of the most recent Libra data
    And I should see the case list table with headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And The defendant names should be links

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

  Scenario: View the case list with data containing 5 cases for the given day
    Given I am an authenticated user
    And I am viewing the "unfilteredShort" case list

    When I navigate to the court list for the chosen day
    Then I should be on the "Cases" page
    And I should see the heading "Cases"

    And I should see the caption with the relevant court
    And I should see the case list table with headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And The defendant names should be links

    And I should not see pagination
    And There should be no a11y violations

  Scenario: View the case list with no data for the given day
    Given I am an authenticated user
    And I am viewing the "empty" case list

    When I navigate to the court list for the chosen day

    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption with the relevant court
    And I should not see the table list
    And I should see the body text "No case data available for this day."
    And I should not see pagination
    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Current offenders and quickly clear that selection
    Given I am an authenticated user
    And I am viewing the "probationStatusFiltered" case list

    When I view the court list
    Then I should see the first defendant on the "unfiltered" list
    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Apply filters" button
    Then I should not see the defendant on the "unfiltered" list
    And I should see the first defendant on the "filtered" list
    And I should only see a list of current defendants
    When I click the clear "Current" filter tag
    Then I should see the first defendant on the "unfiltered" list
    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only court room 1 and quickly clear that selection
    Given I am an authenticated user
    And I am viewing the "courtroomFiltered" case list

    When I view the court list
    Then I should see the first defendant on the "unfiltered" list
    When I click the "Courtroom" filter button
    And I select the "1" filter
    And I click the "Apply filters" button
    Then I should not see the defendant on the "unfiltered" list
    And I should see the first defendant on the "filtered" list
    And I should only see a list of cases in court room 1
    When I click the clear "1" filter tag
    Then I should see the first defendant on the "unfiltered" list
    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only the afternoon session and quickly clear that selection
    Given I am an authenticated user
    And I am viewing the "sessionFiltered" case list

    When I view the court list
    Then I should see the first defendant on the "unfiltered" list
    When I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Apply filters" button
    Then I should not see the defendant on the "unfiltered" list
    And I should see the first defendant on the "filtered" list
    And I should only see a list of cases in the afternoon session
    When I click the clear "Afternoon" filter tag
    Then I should see the first defendant on the "unfiltered" list
    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Current offenders in courtroom 1 during the afternoon session and quickly clear the selections
    Given I am an authenticated user
    And I am viewing the "fullFiltered" case list

    When I view the court list
    Then I should see the first defendant on the "unfiltered" list
    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Courtroom" filter button
    And I select the "1" filter
    And I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Apply filters" button
    Then I should not see the defendant on the "unfiltered" list
    And I should see the first defendant on the "filtered" list
    And I should only see a list of current defendants
    And I should only see a list of cases in court room 1
    And I should only see a list of cases in the afternoon session
    When I click the "Clear all" link
    Then I should see the first defendant on the "unfiltered" list
    And There should be no a11y violations
