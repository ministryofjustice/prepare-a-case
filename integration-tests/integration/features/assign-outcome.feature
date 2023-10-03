Feature: Outcomes List
  In order to assign an outcome to the current user
  As an authenticated user
  I want to click on the Outcomes link in the Primary navigation
  So that I can go to the Outcomes page.
  
  Scenario: Clicking on a Outcome should allow the user to assign to themselves
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/outcomes" base route
    Then I should be on the "Hearing outcomes" page

    And I should see a tab with text "Cases to result (2)"
    And I should see a tab with text "In progress (5)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "English Madden" link
    Then I should "see" the modal popup to assign hearing outcome
    And the modal popup should have text heading "Do you want to result this case now?"
    And the modal popup should have text paragraph "You can view this case but it has not been assigned to you to result."
    And the modal popup should have the button "Assign to me"
    And the modal popup should have the link "View without assigning"
    And the modal popup should have the close button

    When I click "Assign to me"
    Then I should be on the "Case summary" page
    And I should see govuk notification banner with header "Success" and message "You are assigned to result this case. It has moved to the in progress tab."

  Scenario: Clicking on a Outcome should allow the user to view the case without assigning to themselves
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/outcomes" base route
    Then I should be on the "Hearing outcomes" page

    And I should see a tab with text "Cases to result (2)"
    And I should see a tab with text "In progress (5)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "English Madden" link
    Then I should "see" the modal popup to assign hearing outcome
    And the modal popup should have text heading "Do you want to result this case now?"
    And the modal popup should have text paragraph "You can view this case but it has not been assigned to you to result."
    And the modal popup should have the button "Assign to me"
    And the modal popup should have the link "View without assigning"
    And the modal popup should have the close button

    When I click "View without assigning"
    Then I should be on the "Case summary" page
    And I should not see govuk notification banner

  Scenario: Close assign outcome modal popup
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/outcomes" base route
    Then I should be on the "Hearing outcomes" page

    And I should see a tab with text "Cases to result (2)"
    And I should see a tab with text "In progress (5)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "English Madden" link
    Then I should "see" the modal popup to assign hearing outcome

    And I click button "X" on hearing outcome modal popup
    Then I should "NOT see" the modal popup to assign hearing outcome