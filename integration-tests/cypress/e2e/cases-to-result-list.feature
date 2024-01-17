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

    And I should see a tab with text "Cases to result (7)"

    And I should see a tab with text "In progress (5)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |
    And I should see 4 numbered pagination links from 1 to 4 followed by a link Next
    And I should see the pagination numbers 1 to 2 of 7 results

    When I click the "Next" link in the pagination links
    Then the page 2 should be loaded
    And I should see 4 numbered pagination links from 1 to 4 followed by a link Next
    And I should see the pagination numbers 3 to 4 of 7 results
    And I should see the following table rows
      | Gill Arnold Page2    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden Page2 | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Next" link in the pagination links
    Then the page 3 should be loaded
    And I should see 4 numbered pagination links from 1 to 4 followed by a link Next
    And I should see the pagination numbers 5 to 6 of 7 results
    And I should see the following table rows
      | Gill Arnold Page3    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden Page3 | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Previous" link in the pagination links
    Then the page 2 should be loaded
    And I should see 4 numbered pagination links from 1 to 4 followed by a link Next
    And I should see the pagination numbers 3 to 4 of 7 results
    And I should see the following table rows
      | Gill Arnold Page2    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 |
      | English Madden Page2 | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    And There should be no a11y violations

  Scenario: Ensure the correct messages and results are shown when no cases are to be resulted
    Given I am an authenticated user
    When I navigate to the Northampton Court "outcomes" route
    Then I should be on the "Hearing outcomes" page
    Then I should see the body text "There are no cases to be resulted."
    And There should be no a11y violations
