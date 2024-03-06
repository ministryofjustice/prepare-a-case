Feature: Case progress
  I need to quickly and easily record notes about a case
  So that I can make important information, or actions, visible to others
  As an authenticated user
  I want to add and see a case's comments

  Scenario: Add hearing note UI
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page
    And I should see the caption text "URN: 01WW0298121"

    And I should see the level 2 heading "Case progress"
    And I should see 6 previous hearings headers
    And I should see "Add a note" link on hearing with id "f26d6d4e-b987-417e-8323-18009ee001af"

    When I click Add a note on hearing with id "f26d6d4e-b987-417e-8323-18009ee001af"
    Then I should see a text area wih label Add note on hearing with id "f26d6d4e-b987-417e-8323-18009ee001af"
    And I should see a Save button on hearing with id "f26d6d4e-b987-417e-8323-18009ee001af"
    And I should see a Cancel link on hearing with id "f26d6d4e-b987-417e-8323-18009ee001af"

  Scenario: View hearing note on the case summary page
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page
    And I should see the caption text "URN: 01WW0298121"

    And I should see the following summary list
      | Name          | Kara Ayers                                                            |
      | Gender        | Female                                                                |
      | Date of birth | 31 October 1980 (41 years old)                                        |
      | Address       | 22 Waldorf Court Cardiff AD21 5DR                                     |

    And I should see the level 2 heading "Case progress"
    And I should see 6 previous hearings headers

    And I should see the following hearings with the hearing type label, hearing details and next appearance badge if applicable
      | Millionth hearing   | Sunday 14 July 2999, Court 1, morning session, Neptune Mags       |                 |
      | Million-1th hearing | Saturday 14 July 2998, Court 1, morning session, Mars Mags        | NEXT APPEARANCE |
      | 12th hearing        | Saturday 14 December 2019, Court 2, morning session, Leicester    |                 |
      | 8th hearing         | Wednesday 14 August 2019, Court 2, morning session, Leicester     |                 |
      | 7th hearing         | Sunday 14 July 2019, Court 1, morning session, Leicester          |                 |
      | 5th hearing         | Tuesday 14 May 2019, Court 2, morning session, North Shields      |                 |

    And I should see a bottom border on all notes within a hearing
    And I should see a button with the label "Show all previous hearings"

    When I click the "Show all previous hearings" button
    Then I should see 10 previous hearings headers

    And I should see the following hearings with the hearing type label, hearing details and next appearance badge if applicable
      | Millionth hearing   | Sunday 14 July 2999, Court 1, morning session, Neptune Mags       |                 |
      | Million-1th hearing | Saturday 14 July 2998, Court 1, morning session, Mars Mags        | NEXT APPEARANCE |
      | 12th hearing        | Saturday 14 December 2019, Court 2, morning session, Leicester    |                 |
      | 8th hearing         | Wednesday 14 August 2019, Court 2, morning session, Leicester     |                 |
      | 7th hearing         | Sunday 14 July 2019, Court 1, morning session, Leicester          |                 |
      | 5th hearing         | Tuesday 14 May 2019, Court 2, morning session, North Shields      |                 |
      | 4th hearing         | Sunday 14 April 2019, Court 3, morning session, Leicester         |                 |
      | 3rd hearing         | Thursday 14 March 2019, Court 3, morning session, Leicester       |                 |
      | 2nd hearing         | Thursday 14 February 2019, Court 5, afternoon session, Leicester  |                 |
      | 1st hearing         | Monday 14 January 2019, Court 1, morning session, Leicester       |                 |

    And I should see a button with the label "Hide older hearings"

    When I click the "Hide older hearings" button
    Then I should see 6 previous hearings headers
    And I should see a button with the label "Show all previous hearings"

  Scenario: Delete hearing note on the case summary page
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
    And I should see 6 previous hearings headers

    When I click delete hearing note with id "1288880" on hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e3"
    Then I should see the heading "Are you sure you want to delete this note?"
    And I should see the text "Added on the Saturday 9 July 2022" within element with class "govuk-caption-m"
    And I should see a button with the label "Delete note"
    And I should see link "Cancel" with href "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary#case-progress-hearing-2aa6f5e0-f842-4939-bc6a-01346abc09e3"

    When I click the "Delete note" button
    Then I should be on the "Case summary" page
    And I should see govuk notification banner with header "Success" and message "You successfully deleted a note"

    When I click delete hearing note with id "1234560" on hearing "1f93aa0a-7e46-4885-a1cb-f25a4be33a00"
    Then I should see the heading "Are you sure you want to delete this note?"
    And I should see the text "Added on the Saturday 9 July 2022" within element with class "govuk-caption-m"
    And I should see a button with the label "Delete note"
    And I should see link "Cancel" with href "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary#case-progress-hearing-1f93aa0a-7e46-4885-a1cb-f25a4be33a00"

    When I click the "Cancel" link
    Then I should be on the "Case summary" page
    And I should not see govuk notification banner

  Scenario: Display hearing notes
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
    And I should see 6 previous hearings headers
    And I should see below notes on hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7" with author datetime and note with edit and delete links
      | John Doe    | 9 August 2022, 17:16  | Result: 6 months Community Order 10 RAR UPW - 50hrs court costs induction required at local office.   |
      | Jane Smith  | 9 July 2022, 17:13    | Result: 12 months Community Order 10 RAR UPW - 100hrs court costs induction required at local office. |
    And hearing "2aa6f5e0-f842-4939-bc6a-01346abc09e7" should have a draft note with text "This is a draft note"
    And I should see a warning banner on hearing "1f93aa0a-7e46-4885-a1cb-f25a4be33a00" with text "This note was added to a case with more than one defendant. Delete the note if it is not relevant to this defendant."

