Feature: Matching defendants to nDelius records
  In order to match defendants to probation records
  As an authenticated user
  I want to be able to confirm existing probation records match with defendants appearing in court

  Scenario: View the list of defendants with possible probation record matches for a given day in court
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Defendants with possible nDelius records" page
    And I should see the heading "Defendants with possible nDelius records"
    And I should see the medium heading "2 defendants partially match with existing records."
    And I should see the body text "Review and confirm the correct record for each defendant."
    And I should see the match defendants table with headings
      | Defendant | nDelius records found | Action |

  Scenario: View the list of possible nDelius records
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Defendants with possible nDelius records" page
    And I should see the heading "Defendants with possible nDelius records"
    When I click the "Review records" link
    Then I should be on the "Review possible nDelius records" page
    And I should see the heading "Guadalupe Hess"
    And I should see the level 2 heading "Review possible nDelius records"
    And I should see the level 3 heading "Defendant details"
    And I should see the legend "3 nDelius records found"
    And I should see the body text "Compare details and confirm the correct record for the defendant."
    And I should see the following table headings
      | Name | DOB | Address |
    And I am using the "defendantRecords" match data
    And I should see the defendant record options
    And I should see radio buttons with the following IDs
      | defendant-1 | defendant-2 | defendant-3 |

  Scenario: Display an error message if the user does not select a radio button when confirming a match
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Defendants with possible nDelius records" page
    When I click the "Review records" link
    Then I should be on the "Review possible nDelius records" page
    When I click the "Confirm record" button
    Then I should see the error message "Select an nDelius record"
