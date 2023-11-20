Feature: Resulted Cases List filters
  In order to view the specific list of resulted cases
  As an authenticated user
  I want to be able to apply filters to a resulted cases list view

  Scenario: Display no matching cases message when no cases are returned due to applied filters
    Given I am an authenticated user
    When I navigate to the "outcomes/resulted-cases" route
    Then I should be on the "Hearing outcomes" page

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |  Resulted by |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Joe Blogs \n on 11 Sep 2023 at 09:50   |
      | Hazel Nutt     | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Olive Tree \n on 11 Aug 2023 at 10:35  |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Johnny Ball \n on 9 Sep 2023 at 14:16  |

    When I click the "Outcome type" filter button
    And I select the "Committed to Crown" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    And I should see a count of "0 cases"
    Then I should see the body text "There are no matching cases."
    And There should be no a11y violations