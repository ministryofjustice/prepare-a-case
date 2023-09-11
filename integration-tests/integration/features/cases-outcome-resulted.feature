Feature: Cases to Result List
  In order to view the list of cases to result
  As an authenticated user
  I need to see a list of cases that need resulting
  So that I can select what I am going to work on
  
  Scenario: Should navigate to hearing outcomes cases to resulted tab and see cases
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page

    And I should see the Primary navigation
    And I should see the Primary navigation "Cases" link

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"
    
    Then I click the "Resulted cases" link
    And I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |  Resulted by |

    And I should see the following table rows
#    Workaround to assert multiline text in table cells: Use ' \n ' to represent line breaks
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Joe Blogs \n on 11 Sep 2023 at 09:50   |
      | Hazel Nutt     | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Olive Tree \n on 11 Aug 2023 at 10:35  |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Johnny Ball \n on 9 Sep 2023 at 14:16  |

    And There should be no a11y violations
