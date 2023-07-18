Feature: Cases to Result List
  In order to view the list of cases to result
  As an authenticated user
  I need to see a list of cases that need resulting
  So that I can select what I am going to work on
  
  Scenario: Clicking on the Outcomes link should take me to the Outcomes page
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page

    And I should see the Primary navigation
    And I should see the Primary navigation "Cases" link

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"
    
    And I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    And There should be no a11y violations