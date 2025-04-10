Feature: Cases In progress List filters
  In order to view the specific list of cases to result
  As an authenticated user
  I want to be able to apply filters to a cases to result list view

  Scenario: A user wants to filter the list to show only "Adjourned" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

    And I should see a tab with text "Cases to result (8)"

    And I should see a tab with text "In progress (21)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Outcome type" filter button
    And I select the "Adjourned" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table 1 rows
      | English Madden | Adjourned | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And I should see the "outcomeType" query have the value "ADJOURNED"

    When I click the clear "Adjourned" filter tag

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only "Other" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Outcome type" filter button
    And I select the "Other" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    And I should see the "outcomeType" query have the value "OTHER"

    When I click the clear "Other" filter tag

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And There should be no a11y violations

  Scenario: A user wants to order the list to show by "Hearing date"
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Hearing" sort button

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And I should see the "hearingDate" query have the value "ASC"

    And There should be no a11y violations

    When I click the "Hearing" sort button

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |

    And I should see the "hearingDate" query have the value "DESC"

  Scenario: Display no matching cases message when no cases are returned due to applied filters
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | Olive Tree     | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Outcome type" filter button
    And I select the "Committed to Crown" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    And I should see a count of "0 cases"
    Then I should see the body text "There are no matching cases."
    And There should be no a11y violations

  Scenario: Court room filter should be displayed and functional
    Given I am an authenticated user
    When I navigate to the "outcomes/resulted-cases" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Resulted by |

    When I click the "Courtroom" filter button
    And I select the "1" filter
    And I click the "Courtroom" filter button
    And I click the "Apply filters" button

    And I should see the "courtRoom" query have the value "01,1,Courtroom 1"

    When I click the clear "1" filter tag