Feature: Case list
  In order to view the list of cases sitting on the day in court
  As an authenticated user
  I want to see a case list view

  Scenario: View the case list with data containing 207 cases for the given day
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    When I clear the filters

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/NMOI4O/"
    And I should see phase banner link "report a bug" with href "https://mojprod.service-now.com/moj_sp?id=sc_cat_item&sys_id=2659ea2b1b600a1425dc6351f54bcb7b"

    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And I should see the current day as "Today"
    And I should see "CASES_TOTAL_DAYS" days navigation bar

    And I should see link "Review defendants with possible NDelius records" with href "/B14LO/match/bulk/"
    And I should see the matching inset text "2 defendants partially match existing records and need review"

    And I should see a tab with text "Hearing outcome still to be added"
    And I should see a tab with text "Hearing outcome added"
    And I should see a tab with text "Recently added (21)"
    And I should see a tab with text "Removed cases (1)"

    And I should see a count of "80 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows by row index
      | 0  | Kara Ayers       | No record                 | Attempt theft from the person of another | 1st | Morning   | Crown Court 3-1 |
      | 1  | Mann Carroll     | {PSR} Pre-sentence record | Assault by beating                       | 3rd | Morning   | 2               |
      | 2  | Guadalupe Hess   | {Possible}                | Assault by beating                       |     | Morning   | Crown Court 3-1 |
      | 3  | Charlene Hammond | Previously known          | Theft from the person of another         | 3rd | Afternoon | 10              |
      | 10 | Olsen Alexander  | {SSO} Current             | Theft from a shop                        | 2nd | Morning   | 2               |
      | 11 | English Madden   | {Breach} Current          | Attempt theft from the person of another | 2nd | Morning   | 6               |


    And I should see link "Kara Ayers" with href "/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary"
    And I should see link "Mann Carroll" with href "/hearing/a395526d-b805-4c52-8f61-3c41bca15537/defendant/d1d38809-af04-4ff0-9328-4db39c0a3d85/summary"
    And I should see secondary text "V654123"

    And I should see pagination
    And I should not see pagination previous link
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "page=2"
    And I should see pagination link "3" with href "page=3"
    And I should see pagination next link with href "page=2"
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
    When I clear the filters

    # Repeat some tests to ensure UI is consistent on subsequent pages
    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And I should see the current day as "Today"
    And I should see "CASES_TOTAL_DAYS" days navigation bar

    And I should see link "Review defendants with possible NDelius records" with href "/B14LO/match/bulk/"
    And I should see the matching inset text "2 defendants partially match existing records and need review"

    And I should see a tab with text "Hearing outcome still to be added"
    And I should see a tab with text "Hearing outcome added"
    And I should see a tab with text "Recently added (21)"
    And I should see a tab with text "Removed cases (1)"

    And I should see a count of "80 cases"

    When I click pagination link "2"

    Then I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And I should see link "Robert Hardin" with href "/hearing/bbe36cfc-dc6f-421f-bac2-d4ae987d618f/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary"
    And I should see link "Vance Landry" with href "/hearing/6046236a-5517-4445-a349-73f8f653b23a/defendant/903ecefd-8697-4d0e-bf01-f892f9dee7e7/summary"

    And I should see pagination
    And I should see pagination previous link with href "page=1"
    And I should see pagination link "1" with href "page=1"
    And I should see pagination page "2" highlighted
    And I should see pagination link "3" with href "page=3"
    And I should see pagination link "4" with href "page=4"
    And I should see pagination next link with href "page=3"
    And There should be no a11y violations

  Scenario: View the recently added cases on the case list
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    When I click the "Recently added (21)" link
    Then I should be on the "Recently added cases" page

    Then I should see medium heading with text "80 cases added to today's case list."

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And I should see link "Sara Ortega" with href "/hearing/228fdfe6-0056-47ce-974d-b0ba9cc6d6f8/defendant/c8fe5f8a-57f2-43a0-b5fb-73562036f080/summary"
    And I should see link "Pamela Stanton" with href "/hearing/f9a66faa-a758-46d3-928c-8666367f6649/defendant/b8ea0ada-bc7f-4aed-99e3-1b3146274df6/summary"

    And I should see pagination
    And I should not see pagination previous link
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "added?page=2"
    And I should see pagination next link with href "added?page=2"
    And There should be no a11y violations

    # Test state held in session
    When I navigate to the "cases" route
    Then I should be on the "Recently added cases" page
    And I should see medium heading with text "80 cases added to today's case list."

  Scenario: View the removed cases on the case list
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    When I click the "Removed cases (1)" link
    Then I should be on the "Removed cases" page

    Then I should see medium heading with text "80 cases removed from today's case list."

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court | Libra case number |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And I should see link "Geoff McTaggart" with href "/hearing/bae9a472-d1fc-403d-b639-a65d304089a2/defendant/523137c4-4dfe-40a4-aa99-9cbe64bf0476/summary"

    And There should be no a11y violations

    # Test state held in session
    When I navigate to the "cases" route
    Then I should be on the "Removed cases" page
    And I should see medium heading with text "80 cases removed from today's case list."

  Scenario: View the case list with no data for the given day
    Given I am an authenticated user

    When I navigate to the "cases/2020-01-01" route
    Then I should be on the "Case list" page
    And I should see the current day as "Wednesday 1 January"
    And I should not see days navigation bar

    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And I should not see that any defendants have possible NDelius records


    And I should not see the table list
    And I should see the body text "No case list information available."
    And I should not see pagination
    And There should be no a11y violations

  Scenario: Show error page when get case list backend endpoint returns error
    Given I am an authenticated user

    When I navigate to the "cases/2019-12-12" route

    And I should see the heading "Sorry, there is a problem with the service"
    And I should see the body text "Try refreshing the page or going back and trying again."
    And I should see the body text "Use this form to tell us about the problem."
