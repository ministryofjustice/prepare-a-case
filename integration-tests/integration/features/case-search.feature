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
    And I should see the text input label "Enter the CRN or the name of the case you are searching for"

    When I enter "CRN007" into text input with id "search-term"
    And I click the "Search" button
    Then I should see the level 3 heading "“3” search results for “CRN007”"
    And I should see the following table headings
      | Defendant | Probation status | Offence | Last hearing | Next hearing |
    And I should see the following table rows
      | Kara Ayers    | Current  | Theft from the person        | 16 December 2022 | 23 January 2023 |
      | Adam Sandler  | Current  | Theft two from the person    | 16 December 2022 |                 |
      | Adam Sandler  | Current  | Theft three from the person  |                  | 23 January 2023 |
    And I see value "CRN007" in the text input with id "search-term"

  Scenario: Should not show result table when search for given CRN does not return result
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And I should see the level 2 heading "Search"
    And I should see a button with the label "Search"
    And I should see the text input label "Enter the CRN or the name of the case you are searching for"

    When I enter "no-result" into text input with id "search-term"
    And I click the "Search" button
    Then I should see the level 3 heading "“0” search results for “no-result”"
    And I see value "no-result" in the text input with id "search-term"



