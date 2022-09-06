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

    And I should see the level 2 heading "Case progress"
    And I should see 6 previous hearings

    And I should see the following hearings with the hearing type label, hearing details
      | 12th hearing | 14 December 2019, 09:00, Court 2, morning session, Leicester  |
      | 8th hearing  | 14 August 2019, 09:00, Court 2, morning session, Leicester    |
      | 7th hearing  | 14 July 2019, 09:00, Court 1, morning session, Leicester      |
      | 5th hearing  | 14 May 2019, 09:00, Court 2, morning session, North Shields   |
      | 4th hearing  | 14 April 2019, 09:00, Court 3, morning session, Leicester     |
      | 3rd hearing  | 14 March 2019, 09:00, Court 3, morning session, Leicester     |

    And I should see a button with the label "Show all previous hearings"

    When I click the "Show all previous hearings" button
    Then I should see 8 previous hearings

    And I should see the following hearings with the hearing type label, hearing details
      | 12th hearing | 14 December 2019, 09:00, Court 2, morning session, Leicester   |
      | 8th hearing  | 14 August 2019, 09:00, Court 2, morning session, Leicester     |
      | 7th hearing  | 14 July 2019, 09:00, Court 1, morning session, Leicester       |
      | 5th hearing  | 14 May 2019, 09:00, Court 2, morning session, North Shields    |
      | 4th hearing  | 14 April 2019, 09:00, Court 3, morning session, Leicester      |
      | 3rd hearing  | 14 March 2019, 09:00, Court 3, morning session, Leicester      |
      | 2nd hearing  | 14 February 2019, 09:00, Court 5, afternoon session, Leicester |
      | 1st hearing  | 14 January 2019, 09:00, Court 1, morning session, Leicester    |

    And I should see a button with the label "Hide older hearings"

    When I click the "Hide older hearings" button
    Then I should see 6 previous hearings
    And I should see a button with the label "Show all previous hearings"



