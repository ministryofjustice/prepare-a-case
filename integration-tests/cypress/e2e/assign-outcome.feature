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

    And I should see a tab with text "Cases to result (7)"
    And I should see a tab with text "In progress (5)"

    And I should see the following table headings
      || Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      || Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      || English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "English Madden" link
    Then I should "see" the "assign-outcome-modal" modal
    And the "assign-outcome-modal" modal should have the text heading "Do you want to result this case now?"
    And the "assign-outcome-modal" modal should have the text paragraph "You can view this case but it has not been assigned to you to result."
    And the "assign-outcome-modal" modal should have the button "Assign to me"
    And the "assign-outcome-modal" modal should have the link as button "View without assigning"
    And the "assign-outcome-modal" modal should have the Cancel link as button

    When I click the "assign-outcome-modal" modal "Assign to me" button
    Then I should be on the "Case summary" page
    And I should see govuk notification banner with header "Success" and message "You are assigned to result this case. It has moved to the in progress tab."

  Scenario: Clicking on a Outcome should allow the user to view the case without assigning to themselves
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/outcomes" base route
    Then I should be on the "Hearing outcomes" page

    And I should see a tab with text "Cases to result (7)"
    And I should see a tab with text "In progress (5)"

    And I should see the following table headings
      || Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      || Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      || English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "English Madden" link
    Then I should "see" the "assign-outcome-modal" modal
    And the "assign-outcome-modal" modal should have the text heading "Do you want to result this case now?"
    And the "assign-outcome-modal" modal should have the text paragraph "You can view this case but it has not been assigned to you to result."
    And the "assign-outcome-modal" modal should have the button "Assign to me"
    And the "assign-outcome-modal" modal should have the link as button "View without assigning"
    And the "assign-outcome-modal" modal should have the Cancel link as button

    When I click the "assign-outcome-modal" modal "View without assigning" link as button
    Then I should be on the "Case summary" page
    And I should not see govuk notification banner

  Scenario: Close assign outcome modal popup
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/outcomes" base route
    Then I should be on the "Hearing outcomes" page

    And I should see a tab with text "Cases to result (7)"
    And I should see a tab with text "In progress (5)"

    And I should see the following table headings
      || Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      || Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      || English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "English Madden" link
    Then I should "see" the "assign-outcome-modal" modal

    When I click the Cancel option on the "assign-outcome-modal" modal
    Then I should "NOT see" the "assign-outcome-modal" modal