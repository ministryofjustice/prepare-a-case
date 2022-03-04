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
      | Kara Ayers     | No record                 | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |
      | Mann Carroll   | {Psr} Pre-sentence record | Assault by beating                       | 3rd | Morning | 2               |
      | Guadalupe Hess | {Possible}                | Assault by beating                       |     | Morning | Crown Court 3-1 |

    And I should see link "Kara Ayers" with href "/case/0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary"
    And I should see link "Mann Carroll" with href "/case/18745630-1398-42b3-b6bc-435325241cc6/defendant/d1d38809-af04-4ff0-9328-4db39c0a3d85/summary"
    And I should see secondary text "V654123"

    And I should see pagination
    And I should not see pagination link "Previous"
    And I should not see pagination link "1"
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "?page=2"
    And I should see pagination link "3" with href "?page=3"
    And I should see pagination link "Next" with href "?page=2"
    And I should see pagination text "Showing 1 to 20 of 207 results"
    And There should be no a11y violations

  Scenario: View specific offence data on the case list
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And Defendant "Guadalupe Hess" should display the following "Offence" data
      | Assault by beating | Attempt theft from the person of another |
    And Defendant "Olsen Alexander" should display the following "Offence" data
      | Theft from a shop |

  Scenario: View specific listing data on the case list
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And Defendant "Latoya Kirkland" should display the following "Listing" data
      | 2nd | 4th | 6th | 8th | 10th |
    And Defendant "Dora Clayton" should display the following "Listing" data
      | 1st |

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

    And I should see link "Robert Hardin" with href "/case/e4833681-366f-4e4d-9e8e-97852ad065fd/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"
    And I should see link "Vance Landry" with href "/case/d1a5a715-d8cc-4364-9aff-fe2062838326/defendant/903ecefd-8697-4d0e-bf01-f892f9dee7e7/summary"

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

    And I should see link "Amanda McKay" with href "/case/36a7a502-70b2-4071-8996-e095717a26b7/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"
    And I should see link "Perry Delacruz" with href "/case/36a7a502-70b2-4071-8996-e095717a26b7/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"

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

    And I should see link "Leticia Santana" with href "/case/36a7a502-70b2-4071-8996-e095717a26b7/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"
    And I should see link "Maribel Camacho" with href "/case/36a7a502-70b2-4071-8996-e095717a26b7/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"

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

    And I should see link "Luisa Alston" with href "/case/194e7037-2a6e-4f61-8794-dc2f72738518/defendant/2c4dc41c-1e52-4993-9c39-15295427b693/summary"
    And I should see link "Macdonald Ellison" with href "/case/31d27795-b94d-433f-a756-6136a74f7726/defendant/ff79634e-b5c1-430a-9db8-3caffe0a7a26/summary"

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
      | Sara Ortega   | Previously known | Assault by beating | 1st | Morning | 3 |
      | Obrien McCall | No record        | Theft from a shop  | 2nd | Morning | 8 |

    And I should see link "Sara Ortega" with href "/case/7cd249df-b851-4bf5-a819-4ba0a0614d70/defendant/c8fe5f8a-57f2-43a0-b5fb-73562036f080/summary"
    And I should see link "Obrien McCall" with href "/case/f2ae5024-bc08-4317-bec1-9c68ede45627/defendant/b8ea0ada-bc7f-4aed-99e3-1b3146274df6/summary"

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

    And I should see link "Geoff McTaggart" with href "/case/4c2ff8e9-b1ef-44f9-b88d-472aff27fe9f/defendant/523137c4-4dfe-40a4-aa99-9cbe64bf0476/summary"

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

    And I should see link "Gill Arnold" with href "/case/36a7a502-70b2-4071-8996-e095717a26b7/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"
    And I should see link "Cornelia McCoy" with href "/case/36a7a502-70b2-4071-8996-e095717a26b7/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"

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
