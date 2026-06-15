Feature: Case search
  In order to find cases pertaining to a defendant
  As an authenticated user
  I want to search cases by CRN and see the list of cases

  Scenario: Search for cases with the given CRN
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And I should see the level 2 heading "Search"
    And I should see a button with the label "Search"
    And I should see the text input label "Enter the CRN or full name of the person you are searching for."

    When I enter "C123456" into text input with id "search-term"
    And I click the "Search" button
    Then I should see the level 3 heading "125 search results for C123456"
    And I should see the following table headings
      | Defendant | Probation status | Offence | Last hearing | Next hearing |
    And I should see the following table rows
      | Kara Ayers    | Current  | Theft from the person        | 16 December 2022 | 23 January 2023 |
      | Adam Sandler  | Current  | Theft two from the person    | 16 December 2022 | No record       |
      | Adam Sandler  | Current  | Theft three from the person  | No record        | 23 January 2023 |
    And I see value "C123456" in the text input with id "search-term"

    When I enter "Jeff Bloggs" into text input with id "search-term"
    And I click the "Search" button
    Then I should see the level 3 heading "125 search results for C123456"
    And I should see the following table headings
      | Defendant | Probation status | Offence | Last hearing | Next hearing |
    And I should see the following table rows
      | Kara Ayers    | Current  | Theft from the person        | 16 December 2022 | 23 January 2023 |
      | Adam Sandler  | Current  | Theft two from the person    | 16 December 2022 | No record       |
      | Adam Sandler  | Current  | Theft three from the person  | No record        | 23 January 2023 |
    And I see value "Jeff Bloggs" in the text input with id "search-term"

  Scenario: Should not show result table when search for given CRN does not return result
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And I should see the level 2 heading "Search"
    And I should see a button with the label "Search"
    And I should see the text input label "Enter the CRN or full name of the person you are searching for."

    When I enter "none" into text input with id "search-term"
    And I click the "Search" button
    Then I should see the level 3 heading "0 search results for none"
    And I see value "none" in the text input with id "search-term"

  Scenario: Case search results pagination
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And I should see the level 2 heading "Search"
    And I should see a button with the label "Search"
    And I should see the text input label "Enter the CRN or full name of the person you are searching for."

    When I enter "C123456" into text input with id "search-term"
    And I click the "Search" button
    Then I should see the level 3 heading "125 search results for C123456"
    And I should see pagination text "Showing 1 to 20 of 125 results"
    And I should see pagination
    And I should not see pagination previous link
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "page=2"
    And I should see an ellipsis on the pagination
    And I should see pagination link "7" with href "page=7"
    And I should see pagination next link with href "page=2"

    When I click pagination next link
    Then the page 2 should be loaded
    And I should see pagination text "Showing 21 to 40 of 125 results"
    And I should see pagination previous link with href "page=1"
    And I should see pagination link "1" with href "page=1"
    And I should see pagination page "2" highlighted
    And I should see pagination link "3" with href "page=3"
    And I should see an ellipsis on the pagination
    And I should see pagination link "7" with href "page=7"
    And I should see pagination next link with href "page=3"

    When I click pagination next link
    Then I click pagination link "4"
    Then the page 4 should be loaded
    And I should see pagination text "Showing 61 to 80 of 125 results"
    And I should see pagination previous link with href "page=3"
    And I should see pagination link "1" with href "page=1"
    And I should see pagination link "2" with href "page=2"
    And I should see pagination link "3" with href "page=3"
    And I should see pagination page "4" highlighted
    And I should see pagination link "5" with href "page=5"
    And I should see pagination link "6" with href "page=6"
    And I should see pagination link "7" with href "page=7"
    And I should see pagination next link with href "page=5"
    And I should not see an ellipsis on the pagination

    When I click pagination link "7"
    Then the page 7 should be loaded
    And I should not see pagination next link
    And I should see pagination page "7" highlighted
    And I should see pagination link "6" with href "page=6"
    And I should see an ellipsis on the pagination
    And I should see pagination link "1" with href "page=1"
    And I should see pagination previous link with href "page=6"

  Scenario: Should handle case search errors
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And I should see the level 2 heading "Search"
    And I should see a button with the label "Search"
    And I should see the text input label "Enter the CRN or full name of the person you are searching for."

    When I enter search term "A12345" into search input and click search then I should see error "Enter a CRN in the format one letter followed by 6 numbers, for example A123456."
    When I enter search term "A12345G" into search input and click search then I should see error "Enter a CRN in the format one letter followed by 6 numbers, for example A123456."
    When I enter search term " " into search input and click search then I should see error "You must enter a CRN or a person’s name."
    When I enter search term "o’hara" into search input and click search then I should see error "CRNs and names can only contain numbers 0 to 9, letters A to Z, hyphens and apostrophes."
    When I enter search term "o'hara" into search input and click search then I should see error "NO_ERROR"
    When I enter search term "o-hara" into search input and click search then I should see error "NO_ERROR"
    When I enter search term "A123456" into search input and click search then I should see error "NO_ERROR"
    When I enter search term "Joe Blogs" into search input and click search then I should see error "NO_ERROR"



