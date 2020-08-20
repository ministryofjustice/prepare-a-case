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
    And I am using the "defendantOneRecords" match data
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

  Scenario: Confirm defendant record match from bulk match list
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Defendants with possible nDelius records" page
    When I click the "Review records" link
    Then I should be on the "Review possible nDelius records" page
    And I am using the "defendantOneRecords" match data
    And I should see the defendant record options
    And I click the element with id "defendant-1"
    And I click the "Confirm record" button
    Then I should be on the "Defendants with possible nDelius records" page
    And I should see the match confirmation banner message

  Scenario: Confirm defendant record match from case summary
    Given I am an authenticated user
    When I navigate to the "match/defendant/3597035492" route
    And I am using the "defendantOneRecords" match data
    And I should see the defendant record options
    And I click the element with id "defendant-1"
    And I click the "Confirm record" button
    Then I should be on the "Case summary" page
    And I should see the match confirmation banner message

  Scenario: Confirm no existing defendant record match from bulk list
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Defendants with possible nDelius records" page
    When I click the "Review records" link
    Then I should be on the "Review possible nDelius records" page
    And I am using the "defendantOneRecords" match data
    And I should see the defendant record options
    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "confirm they have no record" link
    Then I should be on the "Defendants with possible nDelius records" page
    And I should see the no record match confirmation banner message

  Scenario: Manually match a defendant and submit without entering a CRN
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Defendants with possible nDelius records" page
    When I click the "Review records" link
    Then I should be on the "Review possible nDelius records" page
    And I am using the "defendantOneRecords" match data
    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link
    Then I should be on the "Link an nDelius record to the defendant" page
    And I should see the body text "Use a case reference number (CRN) to link to an existing nDelius record to the defendant."
    And I should not see the heading level 2 with text "EDefendant details"
    And I should see the following table headings
      | Name | Date of birth |
    And I should see the level 3 heading "Enter the CRN of the existing record"
    And I should see the text input label "Case reference number (CRN)"
    And I should see the text input with id "crn"
    And I should see the text input hint "For example, A123456"
    When I click the "Find record" button
    Then I should be on the "Link an nDelius record to the defendant" page
    Then I should see the error message "You must enter a case reference number"

  Scenario: Manually match a defendant and submit with an invalid CRN
    Given I am an authenticated user
    When I navigate to the "/match/bulk/" route for today
    And I am using the "bulkList" match data
    Then I should be on the "Defendants with possible nDelius records" page
    When I click the "Review records" link
    Then I should be on the "Review possible nDelius records" page
    And I am using the "defendantOneRecords" match data
    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link
    Then I should be on the "Link an nDelius record to the defendant" page
    When I enter "INVALID" into text input with id "crn"
    And I click the "Find record" button
    Then I should be on the "Link an nDelius record to the defendant" page
    Then I should see the error message "Enter the CRN in the correct format"

  Scenario: Confirm no existing defendant record match from case summary
    Given I am an authenticated user
    When I navigate to the "match/defendant/3597035492" route
    And I am using the "defendantOneRecords" match data
    And I should see the defendant record options
    And I click the "Can't see the correct record?" summary link
    And I click the "confirm they have no record" link
    Then I should be on the "Case summary" page
    And I should see the no record match confirmation banner message

  Scenario: Attempt to confirm match but encounter a server error
    Given I am an authenticated user
    When I navigate to the "match/defendant/4172564047" route
    And I am using the "defendantTwoRecords" match data
    And I should see the defendant record options
    And I click the element with id "defendant-1"
    And I click the "Confirm record" button
    Then I should be on the "Review possible nDelius records" page
    And I should see the match error banner message
