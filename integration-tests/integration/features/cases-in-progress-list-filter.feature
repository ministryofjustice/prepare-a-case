Feature: Cases In progress List filters
  In order to view the specific list of cases to result
  As an authenticated user
  I want to be able to apply filters to a cases to result list view

  Scenario: A user wants to filter the list to show only "Report Requested" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

#    And I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Outcome type" filter button
    And I select the "REPORT_REQUESTED" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

#    Then I should see a tab with text "In progress (1)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table 1 rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |

    And I should see the "outcomeType" query have the value "REPORT_REQUESTED"
    And I should see the "Report requested" filter tag

    When I click the clear "Report requested" filter tag

#    Then I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only "Adjourned" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

#    And I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Outcome type" filter button
    And I select the "ADJOURNED" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

#    Then I should see a tab with text "In progress (1)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table 1 rows
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And I should see the "outcomeType" query have the value "ADJOURNED"

    When I click the clear "Adjourned" filter tag

#    Then I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And There should be no a11y violations


  Scenario: A user wants to filter the list to show only "Other" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

#    And I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Outcome type" filter button
    And I select the "OTHER" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    And I should see the "outcomeType" query have the value "OTHER"

#    Then I should see a tab with text "In progress (0)"

#    And I should see a count of "0 cases"

    When I click the clear "Other" filter tag

#    Then I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And There should be no a11y violations


  Scenario: A user wants to order the list to show by "Hearing date"
    Given I am an authenticated user
    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

#    And I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    When I click the "Hearing" sort button

#    Then I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |

    And I should see the "hearingDate" query have the value "ASC"

    And There should be no a11y violations

    When I click the "Hearing" sort button

#    Then I should see a tab with text "In progress (2)"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date | Action |

    And I should see the following table rows
      | English Madden | Adjourned          | Previously known | Attempt theft from the person of another | 5 Sep 2023 | Move to resulted |
      | Gill Arnold    | Report requested   | Current          | Offence title one                        | 5 Jul 2023 | Move to resulted |

    And I should see the "hearingDate" query have the value "DESC"

