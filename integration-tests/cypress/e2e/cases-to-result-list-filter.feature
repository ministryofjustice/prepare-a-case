Feature: Cases to Result List filters
  In order to view the specific list of cases to result
  As an authenticated user
  I want to be able to apply filters to a cases to result list view

  Scenario: A user wants to filter the list to show only "Report Requested" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    #    And I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Outcome type" filter button
    And I select the "Report requested" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    #    Then I should see a tab with text "Cases to result (1)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table 1 rows
      |  | Gill Arnold | Report requested | Current | Offence title one | 5 Jul 2023 |

    And I should see the "outcomeType" query have the value "REPORT_REQUESTED"

    When I click the clear "Report requested" filter tag

    #    Then I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

  Scenario: A user wants to filter the list to show only "Adjourned" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    #    And I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Outcome type" filter button
    And I select the "Adjourned" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    #    Then I should see a tab with text "Cases to result (1)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table 1 rows
      |  | English Madden | Adjourned | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    And I should see the "outcomeType" query have the value "ADJOURNED"

    When I click the clear "Adjourned" filter tag

    #    Then I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |


  Scenario: A user wants to filter the list to show only "Other" cases to result and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    #    And I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Outcome type" filter button
    And I select the "Other" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    And I should see the "outcomeType" query have the value "OTHER"

    #    Then I should see a tab with text "Cases to result (0)"

    When I click the clear "Other" filter tag

    #    Then I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |


  Scenario: A user wants to order the list to show by "Hearing date"
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    #    And I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Hearing" sort button

    #    Then I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    And I should see the "hearingDate" query have the value "ASC"

    When I click the "Hearing" sort button

    #    Then I should see a tab with text "Cases to result (2)"

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |

    And I should see the "hearingDate" query have the value "DESC"

  Scenario: Display no matching cases message when no cases are returned due to applied filters
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Outcome type" filter button
    And I select the "Probation sentence" filter
    And I click the "Outcome type" filter button
    And I click the "Apply filters" button

    And I should see a count of "0 cases"
    Then I should see the body text "There are no matching cases."

  Scenario: A user wants to filter the list by courtroom
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I clear the filters

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |

    When I click the "Courtroom" filter button
    And I select the "1" filter
    And I click the "Courtroom" filter button
    And I click the "Apply filters" button

    And I should see the following table headings
      |  | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table 1 rows
      |  | Court Room Stub Loaded | Report requested | Current | Offence title one | 5 Jul 2023 |

    And I should see the "courtRoom" query have the value "01,1,Courtroom 1"

    When I click the clear "1" filter tag

    Then I should see the following table rows
      |  | Gill Arnold    | Report requested | Current          | Offence title one                        | 5 Jul 2023 |
      |  | English Madden | Adjourned        | Previously known | Attempt theft from the person of another | 5 Sep 2023 |
