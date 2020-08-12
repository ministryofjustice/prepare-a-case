Feature: Matching defendants to nDelius records
  In order to match defendants to probation records
  As an authenticated user
  I want to be able to confirm existing probation records match with defendants appearing in court

  Scenario: View the list of defendants with possible probation record matches for a given day in court
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Match defendant records" page
    And I should see the heading "Defendants with possible nDelius records"
    And I should see the medium heading "2 defendants partially match with existing records."
    And I should see the body text "Review and confirm the correct record for each defendant."
    And I should see the match defendants table with headings
      | Defendant | nDelius records found | Action |
