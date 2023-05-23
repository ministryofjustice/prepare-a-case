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

    And I should see the level 2 heading "Case progress"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7" should have hearing outcome "Adjourned" sent to admin on "Monday 24 April 2023"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e5" should have hearing outcome "Report requested" sent to admin on "Tuesday 9 May 2023"

  Scenario: Add hearing outcome modal popup
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    And I should see the level 2 heading "Case progress"
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3" should have button "Send outcome to admin"
    And hearing "1f93aa0a-7e46-4885-a1cb-f25a4be33a00" should have button "Send outcome to admin"

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the modal popup to add hearing outcome
    And the modal popup should have text paragraph "Choose an outcome and send this case to admin"
    And the modal popup should have a select input with items
      | Outcome type            |
      | Probation sentence      |
      | Non-probation sentence  |
      | Report requested        |
      | Adjourned               |
      | Committed to Crown      |
      | Crown plus PSR          |
      | Other                   |
    And the modal popup should have the button "Send to admin"
    And the modal popup should have the close button

  Scenario: Add hearing outcome
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the modal popup to add hearing outcome

    When I select "Report requested" from select options
    And I click button "Send to admin" on hearing outcome modal popup
    Then I should see govuk notification banner with header "Success" and message "Outcome sent to admin"

  Scenario: Close hearing outcome modal popup
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the modal popup to add hearing outcome

    And I click button "X" on hearing outcome modal popup
    Then I should "NOT see" the modal popup to add hearing outcome

  Scenario: Hearing outcome - send to admin without selecting outcome
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I click "Send outcome to admin" for hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should "see" the modal popup to add hearing outcome

    When I click button "Send to admin" on hearing outcome modal popup
    Then the modal popup should have text paragraph "Choose an outcome type for this hearing before sending to admin"



