Feature: Case list filters
  In order to view the list of specific cases sitting on the day in court
  As an authenticated user
  I want to be able to apply filters to a case list view

  Scenario: Display no matching cases message when no cases are returned due to applied filters
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Probation status" filter button
    And I click the "Probation status" filter button
    And I select the "No record" filter
    And I click the "Probation status" filter button
    And I click the "Courtroom" filter button
    And I select the "01" filter
    And I click the "Courtroom" filter button
    And I click the "Courtroom" filter button
    And I select the "09" filter
    And I click the "Courtroom" filter button
    And I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Session" filter button
    And I click the "Apply filters" button

    And I should see a count of "66 cases"
    And I should see the following table rows
      | Lenore Marquez  | {Psr} Current          | Attempt theft from the person of another | 2nd | Morning | 6 |
      | Olsen Alexander | {Breach} {Sso} Current | Theft from a shop                        | 2nd | Morning | 2 |
    And There should be no a11y violations
