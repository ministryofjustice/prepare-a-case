
Feature: Case list filters
  In order to view the list of specific cases sitting on the day in court
  As an authenticated user
  I want to be able to apply filters to a case list view

  Scenario: A11y
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And There should be no a11y violations

  Scenario: Apply multiple filters
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "80 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Probation status" filter button

    When I click the "Courtroom" filter button
    And I select the "1" filter
    And I click the "Courtroom" filter button

    When I click the "Session" filter button
    And I select the "Afternoon" filter
    And I click the "Session" filter button

    When I click the "Source" filter button
    And I select the "Common Platform" filter
    And I click the "Source" filter button

    When I click the "Flag" filter button
    And I select the "Breach" filter
    And I click the "Flag" filter button

    And I click the "Apply filters" button

    Then I should see a count of "1 case"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Charlene Hammond | Previously known | Theft from the person of another | 3rd | Afternoon | 10 |


    When I click the clear "Current" filter tag
    When I click the clear "1" filter tag
    When I click the clear "Afternoon" filter tag
    When I click the clear "Common Platform" filter tag
    When I click the clear "Breach" filter tag

    Then I should see a count of "80 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

  Scenario: Display no matching cases message when no cases are returned due to applied filters
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "80 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |
    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Probation status" filter button

    When I click the "Courtroom" filter button
    And I select the "1" filter
    And I click the "Courtroom" filter button

    When I click the "Session" filter button
    And I select the "Morning" filter
    And I click the "Session" filter button

    When I click the "Source" filter button
    And I select the "Common Platform" filter
    And I click the "Source" filter button

    When I click the "Flag" filter button
    And I select the "Breach" filter
    And I click the "Flag" filter button

    And I click the "Apply filters" button

    And I should see a count of "0 cases"
    Then I should see the body text "There are no matching cases."
