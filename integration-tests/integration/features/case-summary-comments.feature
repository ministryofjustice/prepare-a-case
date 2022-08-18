Feature: Case comments
  I need to quickly and easily record notes about a case
  So that I can make important information, or actions, visible to others
  As an authenticated user
  I want to add and see a case's comments

  Scenario: View case comments on case summary page
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

    And I should see the level 2 heading "Comments"
    And I should see a textarea with id "comment"
    And I should see a button with the label "Save"
    And I should see 6 previous comments
    And I should see a button with the label "Show all previous comments"

    When I click the "Show all previous comments" button
    Then I should see 10 previous comments

    And I should see the following comments with the comment, author and date commented on
      | Comment Three     | Adam Sandler Three on 19 August 2022, 17:17 |
      | Comment Six       | Adam Sandler 6 on 19 August 2022, 17:17     |
      | Comment Eight     | Author Two on 19 August 2022, 17:17         |
      | PSR completed     | Author Two on 19 August 2022, 17:17         |
      | Comment One       | Adam Sandler on 9 August 2022, 17:17        |
      | Comment Two       | Adam Sandler Two on 9 August 2022, 17:17    |
      | Comment Four      | Adam Sandler Four on 9 August 2022, 17:17   |
      | Comment Five      | Adam Sandler 5 on 9 August 2022, 17:17      |
      | Comment Seven     | Author Two on 9 August 2022, 17:17          |
      |  PSR completed    | Author Two on 9 August 2022, 17:17          |

    And I should see a button with the label "Hide older comments"

    When I click the "Hide older comments" button
    Then I should see 6 previous comments

    And I should see the following comments with the comment, author and date commented on
      | Comment Three     | Adam Sandler Three on 19 August 2022, 17:17 |
      | Comment Six       | Adam Sandler 6 on 19 August 2022, 17:17     |
      | Comment Eight     | Author Two on 19 August 2022, 17:17          |
      | PSR completed     | Author Two on 19 August 2022, 17:17          |
      | Comment One       | Adam Sandler on 9 August 2022, 17:17         |
      | Comment Two       | Adam Sandler Two on 9 August 2022, 17:17     |

  Scenario: Should show error when the save button is clicked without a comment
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page
    And I should see a button with the label "Save"

    When I click the "Save" button
    Then I should see the comments textarea highlighted as error
    Then I should see an error message "Error: Enter a comment"

  Scenario: Should not show error and successfully save comment
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I enter a comment "a comment" in the comment box
    And I click the "Save" button
    Then I should NOT see an error message
