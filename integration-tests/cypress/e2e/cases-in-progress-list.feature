Feature: Cases in Progress List
  In order to view the list of cases to result
  As an authenticated user
  I need to see a list of cases that need resulting
  So that I can select what I am going to work on

  Scenario: Clicking on the Outcomes link should take me to the Outcomes page
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    And I should see the Primary navigation
    And I should see the Primary navigation "Cases" link

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/PLY6UR/"

    And I should see a tab with text "Cases to result (8)"

    And I should see a tab with text "In progress (21)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And I should see pagination
    And I should not see pagination previous link
    And I should see pagination text "Showing 1 to 2 of 21 results"
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "page=2"
    And I should see pagination next link with href "page=2"

    And There should be no a11y violations

  Scenario: Clicking on the Move to Resulted button should show a banner
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    When I click the Move to resulted button for defendant "English Madden"
    Then I should see govuk notification banner with header "Success" and message "You have moved English Madden's case to resulted cases."

  Scenario: Clicking on a case the user is not assigned to should show a modal
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    And I should see the link "Gill Arnold" in a table row
    And I should see the link "Gill Arnold" "will" open a modal with the "pac-reassign" trigger

    When I click the "Gill Arnold" link
    Then I should "see" the "reassign-outcome-modal" modal

    And I click the Cancel option on the "reassign-outcome-modal" modal
    Then I should "NOT see" the "reassign-outcome-modal" modal

  Scenario: Clicking on a case the user is assigned to should not show a modal and take you directly to the Case Summary
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    And I should see the link "English Madden" in a table row
    And I should see the link "English Madden" "will not" open a modal with the "pac-reassign" trigger

    When I click the "English Madden" link
    Then I should be on the "Case summary" page

  Scenario: Clicking on a case the user is not assigned to should allow the user to assign to themselves
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    When I click the "Olive Tree" link
    Then I should "see" the "reassign-outcome-modal" modal
    And the "reassign-outcome-modal" modal should have the text heading "This case is assigned to someone else"
    And the "reassign-outcome-modal" modal should have the text paragraph "If you need to check some details, open as read only."
    And the "reassign-outcome-modal" modal should have the text paragraph "If the person assigned to it cannot finish resulting it, you should assign it to yourself to result it."
    And the "reassign-outcome-modal" modal should have the button "Assign to me"
    And the "reassign-outcome-modal" modal should have the link as button "Open as read only"
    And the "reassign-outcome-modal" modal should have the Cancel link as button

    When I click the "Assign to me" button
    Then I should be on the "Case summary" page
    And I should see govuk notification banner with header "Success" and message "You are assigned to result this case. It has moved to the in progress tab."

  Scenario: Ensure the correct messages and results are shown when no cases are in progress
    Given I am an authenticated user
    When I navigate to the Northampton Court "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    Then I should see the body text "There are no cases in progress."
    And There should be no a11y violations