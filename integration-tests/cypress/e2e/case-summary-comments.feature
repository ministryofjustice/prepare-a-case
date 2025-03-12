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
    And I should see a textarea with id "case-comment"
    And I should see a button with the label "Save"
    And I should see a link with text Cancel to cancel a draft comment
    And I should see 6 previous comments
    And I should see a button with the label "Show all previous comments"

    When I click the "Show all previous comments" button
    Then I should see 10 previous comments

    And I should see the following comments with the comment, author and date commented on
      | Comment Three     | Adam Sandler Three on 19 August 2022, 17:17 | Do not show delete link | Do not show edit link | Not Legacy |
      | Comment Six       | Adam Sandler 6 on 19 August 2022, 17:17     | Do not show delete link | Do not show edit link | Not Legacy |
      | Comment Eight     | Author Two on 19 August 2022, 17:17         | Show delete link        | Show edit link        | Legacy     |
      | PSR completed     | Author Two on 19 August 2022, 17:17         | Show delete link        | Show edit link        | Not Legacy |
      | Comment One       | Adam Sandler on 9 August 2022, 17:17        | Show delete link        | Show edit link        | Not Legacy |
      | Comment Two       | Adam Sandler Two on 9 August 2022, 17:17    | Show delete link        | Show edit link        | Not Legacy |
      | Comment Four      | Adam Sandler Four on 9 August 2022, 17:17   | Show delete link        | Show edit link        | Not Legacy |
      | Comment Five      | Adam Sandler 5 on 9 August 2022, 17:17      | Show delete link        | Show edit link        | Not Legacy |
      | Comment Seven     | Author Two on 9 August 2022, 17:17          | Show delete link        | Show edit link        | Not Legacy |
      |  PSR completed    | Author Two on 9 August 2022, 17:17          | Show delete link        | Show edit link        | Not Legacy |

    And I should see a button with the label "Hide older comments"

    When I click the "Hide older comments" button
    Then I should see 6 previous comments

    And I should see the following comments with the comment, author and date commented on
      | Comment Three     | Adam Sandler Three on 19 August 2022, 17:17 | Do not show delete link | Do not show edit link | Not Legacy |
      | Comment Six       | Adam Sandler 6 on 19 August 2022, 17:17     | Do not show delete link | Do not show edit link | Not Legacy |
      | Comment Eight     | Author Two on 19 August 2022, 17:17         | Show delete link        | Show edit link        | Legacy     |
      | PSR completed     | Author Two on 19 August 2022, 17:17         | Show delete link        | Show edit link        | Not Legacy |
      | Comment One       | Adam Sandler on 9 August 2022, 17:17        | Show delete link        | Show edit link        | Not Legacy |
      | Comment Two       | Adam Sandler Two on 9 August 2022, 17:17    | Show delete link        | Show edit link        | Not Legacy |

  Scenario: Delete a case comment successfully
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see the caption text "URN: 01WW0298121"

    And I should see the following summary list
      | Name          | Kara Ayers                                                            |

    And I should see the level 2 heading "Comments"
    And I should see 6 previous comments

    When I click "Delete" on the below comment located in table row 3
      | Comment Eight     | Author Two on 19 August 2022, 17:17 |
    Then I should see the heading "Are you sure you want to delete this comment?"
    And I should see the text "Added on the 19 August 2022, 17:17" within element with class "govuk-caption-m"
    And I should see a button with the label "Delete comment"
    And I should see link "Cancel" with href "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary#previousComments"

    When I click the "Delete comment" button
    Then I should be on the "Case summary" page
    And I should see govuk notification banner with header "Success" and message "You successfully deleted a comment"

  Scenario: Cancel a delete comment attempt
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see the caption text "URN: 01WW0298121"

    Then I click "Delete" on the below comment located in table row 5
      | Comment One     | Adam Sandler on 9 August 2022, 17:17 |
    Then I should see the heading "Are you sure you want to delete this comment?"
    And I should see the text "Added on the 9 August 2022, 17:17" within element with class "govuk-caption-m"
    And I should see a button with the label "Delete comment"
    And I should see link "Cancel" with href "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary#previousComments"
    Then I click the "Cancel" link
    Then I should be on the "Case summary" page
    And I should not see govuk notification banner

  Scenario: Should not show error and successfully save comment
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    When I enter a comment "a comment" in the comment box
    And I click the button to "Save" comment
    Then I should NOT see an error message
    And I should see govuk notification banner with header "Success" and message "You successfully added a comment"

  Scenario: Should be able to cancel an edit comment attempt
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page

    And I click "Edit" on the below comment located in table row 5
      | Comment One     | Adam Sandler on 9 August 2022, 17:17 |

    Then the comment displayed in row 5 should be converted into textarea with content "Comment One"

    And I click "Cancel" on the edit textarea in row 5
    Then the edit textarea in row 5 should be transformed to comment display with comment "Comment One"
