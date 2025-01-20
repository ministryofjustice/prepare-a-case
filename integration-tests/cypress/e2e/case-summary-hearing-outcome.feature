Feature: Case progress - Hearing outcome
  I need to add and see the hearing outcome for eligible cases
  So that I can make important information, or actions, visible to others
  As an authenticated user
  I want to add, edit and see a hearing outcomes

  Scenario: Display hearing outcome
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see the caption text "URN: 01WW0298121"

    And I should see the following summary list
      | Name          | Kara Ayers                                                            |
      | Gender        | Female                                                                |
      | Date of birth | 31 October 1980 (41 years old)                                        |
      | Address       | 22 Waldorf Court Cardiff AD21 5DR                                     |

    And I should see a "m" sized level 3 heading with text "Case progress"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7" should have hearing outcome "Adjourned" sent to admin on "Monday 24 April 2023"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e5" should have hearing outcome "Report requested" sent to admin on "Tuesday 9 May 2023"

  Scenario: Add hearing outcome modal
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    And I should see a "m" sized level 3 heading with text "Case progress"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3" should have button "Send outcome to admin"
    And hearing "1f93aa0a-7e46-4885-a1cb-f25a4be33a00" should have button "Send outcome to admin"

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the "add-hearing-outcome-modal" modal
    And the "add-hearing-outcome-modal" modal should have the text heading "Choose an outcome and send this case to admin"
    And the "add-hearing-outcome-modal" modal should have a select input with items
      | Outcome type            |
      | Probation sentence      |
      | Non-probation sentence  |
      | Report requested        |
      | Adjourned               |
      | Committed to Crown      |
      | Crown plus PSR          |
      | Other                   |
    And the "add-hearing-outcome-modal" modal should have the button "Send to admin"
    And the "add-hearing-outcome-modal" modal should have the Cancel link as button
    And There should be no a11y violations

  Scenario: Add hearing outcome
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the "add-hearing-outcome-modal" modal

    When I select the "Report requested" option from the select on the "add-hearing-outcome-modal" modal
    And I click the "add-hearing-outcome-modal" modal "Send to admin" button
    Then I should see govuk notification banner with header "Success" and message "Outcome sent to admin"

  Scenario: Close hearing outcome modal
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the "add-hearing-outcome-modal" modal

    And I click the Cancel option on the "add-hearing-outcome-modal" modal
    Then I should "NOT see" the "add-hearing-outcome-modal" modal

  Scenario: Hearing outcome - send to admin without selecting outcome
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the "add-hearing-outcome-modal" modal

    When I click the "add-hearing-outcome-modal" modal "Send to admin" button
    Then the "add-hearing-outcome-modal" modal should have the error message "Choose an outcome type for this hearing before sending to admin"

  Scenario: No Edit hearing link on resulted case
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/9b9a6ab6-ef6d-485a-a8b4-b79b67e5b1f8/defendant/82bfc40d-389a-46ba-81e1-0829a5fbf6c8/summary" base route
    Then I should be on the "Case summary" page

    And I should see a "m" sized level 3 heading with text "Case progress"
    And hearing "1f93aa0a-7e46-4885-a1cb-f25a4be33a10" should not have link "Edit"

  Scenario: Edit hearing outcome modal
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    And I should see a "m" sized level 3 heading with text "Case progress"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7" should have link "Edit"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e5" should have link "Edit"

    When I click "Edit" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7"
    Then I should "see" the "edit-hearing-outcome-modal" modal
    And the "edit-hearing-outcome-modal" modal should have the text heading "This case is already being resulted"
    And the "edit-hearing-outcome-modal" modal should have the text paragraph "This case is in progress on the outcomes page, which means an admin might already be resulting it based on the original outcome type you selected"
    And the "edit-hearing-outcome-modal" modal should have a select input with label "You can choose an outcome and resend this case to admin"
    And the "edit-hearing-outcome-modal" modal should have a select input with items
      | Outcome type            |
      | Probation sentence      |
      | Non-probation sentence  |
      | Report requested        |
      | Adjourned               |
      | Committed to Crown      |
      | Crown plus PSR          |
      | Other                   |
    And the "edit-hearing-outcome-modal" modal should have the button "Update outcome"
    And the "edit-hearing-outcome-modal" modal should have the Cancel link as button
    And There should be no a11y violations

  Scenario: Edit hearing outcome
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Edit" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7"
    Then I should "see" the "edit-hearing-outcome-modal" modal

    When I select the "Report requested" option from the select on the "edit-hearing-outcome-modal" modal
    And I click the "edit-hearing-outcome-modal" modal "Update outcome" button
    Then I should see govuk notification banner with header "Success" and message "Updated outcome sent"

  Scenario: Close hearing outcome modal popup
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Edit" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7"
    Then I should "see" the "edit-hearing-outcome-modal" modal

    And I click the Cancel option on the "edit-hearing-outcome-modal" modal
    Then I should "NOT see" the "edit-hearing-outcome-modal" modal

  Scenario: Hearing outcome - send to admin without selecting outcome
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Edit" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7"
    Then I should "see" the "edit-hearing-outcome-modal" modal

    When I click the "edit-hearing-outcome-modal" modal "Update outcome" button
    Then the "edit-hearing-outcome-modal" modal should have the error message "Choose an outcome type for this hearing before sending to admin"

  Scenario: Add hearing outcome modal popup from Edit link
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Edit" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e5"
    Then I should "see" the "add-hearing-outcome-modal" modal
    And the "add-hearing-outcome-modal" modal should have the text heading "Choose an outcome and send this case to admin"
    And the "add-hearing-outcome-modal" modal should have a select input with items
      | Outcome type            |
      | Probation sentence      |
      | Non-probation sentence  |
      | Report requested        |
      | Adjourned               |
      | Committed to Crown      |
      | Crown plus PSR          |
      | Other                   |
    And the "add-hearing-outcome-modal" modal should have the button "Send to admin"
    And the "add-hearing-outcome-modal" modal should have the Cancel link as button