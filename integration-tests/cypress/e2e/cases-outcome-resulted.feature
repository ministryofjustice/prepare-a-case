Feature: Resulted Cases List
  In order to view the list of cases to result
  As an authenticated user
  I need to see a list of cases that need resulting
  So that I can select what I am going to work on

  Scenario: Should navigate to hearing outcomes cases to resulted tab and see cases
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    And I should see the Primary navigation
    And I should see the Primary navigation "Cases" link

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/NMOI4O/"

    Then I click the "Resulted cases" link

    And I should see a tab with text "Cases to result (8)"

    And I should see a tab with text "In progress (14)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Resulted by |

    And I should see the following table rows
      #    Workaround to assert multiline text in table cells: Use ' \n ' to represent line breaks
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Joe Blogs \n on 11 Sep 2023 at 09:50  |
      | Hazel Nutt     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Olive Tree \n on 11 Aug 2023 at 10:35 |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Johnny Ball \n on 9 Sep 2023 at 14:16 |

    And I should see pagination
    And I should not see pagination previous link
    And I should see pagination page "1" highlighted
    And I should see pagination link "2" with href "page=2"
    And I should see pagination next link with href "page=2"

    When I click the "Outcome type" filter button
    And I select the "Adjourned" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button
    Then I should see the "Adjourned" filter tag
    And I click the clear "Adjourned" filter tag

    When I click the "Assigned to" filter button
    And I select the "Johnny Ball" filter
    And I click the "Assigned to" filter button
    And I click the "Apply filters" button
    Then I should see the "Johnny Ball" filter tag

    And There should be no a11y violations

  Scenario: Clicking on a resulted case should allow the user to assign to themselves and move to In Progress
    Given I am an authenticated user
    When I navigate to the "outcomes/resulted-cases" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    When I click the "Hazel Nutt" link
    Then I should "see" the "reassign-resulted-outcome-modal" modal
    And the "reassign-resulted-outcome-modal" modal should have the text heading "This case has been resulted"
    And the "reassign-resulted-outcome-modal" modal should have the text paragraph "If you need to check some details, open as read only."
    And the "reassign-resulted-outcome-modal" modal should have the text paragraph "To result it again, assign it to yourself."
    And the "reassign-resulted-outcome-modal" modal should have the button "Assign to me"
    And the "reassign-resulted-outcome-modal" modal should have the link as button "Open as read only"
    And the "reassign-resulted-outcome-modal" modal should have the Cancel link as button

    When I click the "Assign to me" button
    Then I should be on the "Case summary" page
    And I should see govuk notification banner with header "Success" and message "You are assigned to result this case. It has moved to the in progress tab."

  Scenario: Clicking on a Outcome should allow the user to view the case without assigning to themselves
    Given I am an authenticated user
    When I navigate to the "outcomes/resulted-cases" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    When I click the "Hazel Nutt" link
    Then I should "see" the "reassign-resulted-outcome-modal" modal

    When I click the "reassign-resulted-outcome-modal" modal "Open as read only" link as button
    Then I should be on the "Case summary" page
    And I should not see govuk notification banner

  Scenario: Ensure the correct messages and results are shown when no cases are resulted
    Given I am an authenticated user
    When I navigate to the Northampton Court "outcomes/resulted-cases" route
    Then I should be on the "Hearing outcomes" page
    Then I should see the body text "There are no resulted cases."
    And There should be no a11y violations
