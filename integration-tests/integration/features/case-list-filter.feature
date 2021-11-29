Feature: Case list filters
  In order to view the list of specific cases sitting on the day in court
  As an authenticated user
  I want to be able to apply filters to a case list view

  Scenario: A user wants to filter the list to show only Current offenders and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Probation status" filter button
    And I click the "Apply filters" button

    Then I should see a count of "66 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Lenore Marquez  | {Psr} Current          | Attempt theft from the person of another | 2nd | Morning | 6 |
      | Olsen Alexander | {Breach} {Sso} Current | Theft from a shop                        | 2nd | Morning | 2 |

    When I click the clear "Current" filter tag

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only court room 1 and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "cases" route
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Courtroom" filter button
    And I select the "01" filter
    And I click the "Courtroom" filter button
    And I click the "Apply filters" button

    Then I should see a count of "22 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Ruth Martin | Previously known | Theft from the person of another | 1st | Morning | 1 |

    When I click the clear "1" filter tag

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only the afternoon session and quickly clear that selection
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Session" filter button
    And I click the "Apply filters" button

    Then I should see a count of "6 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Charlene Hammond | Previously known | Theft from the person of another | 3rd | Afternoon | 10 |

    When I click the clear "Afternoon" filter tag

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Current offenders in court room 1 during the afternoon session and quickly clear the selections
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Probation status" filter button
    And I click the "Courtroom" filter button
    And I select the "01" filter
    And I click the "Courtroom" filter button
    And I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Session" filter button
    And I click the "Apply filters" button

    Then I should see a count of "1 case"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Porter Salas | Current | Theft from the person of another | 2nd | Afternoon | 1 |

    When I click the "Clear all" link

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only offenders with a Possible NDelius record in Crown Court 3-1
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Possible NDelius record" filter
    And I click the "Probation status" filter button
    And I click the "Courtroom" filter button
    And I select the "Crown Court 3-1" filter
    And I click the "Courtroom" filter button
    And I click the "Apply filters" button

    Then I should see a count of "1 case"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Guadalupe Hess | Possible NDelius Record | Assault by beating |  | Morning | Crown Court 3-1 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Pre-sentence record offenders and quickly clear the selections
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Pre-sentence record" filter
    And I click the "Probation status" filter button
    And I click the "Apply filters" button

    Then I should see a count of "1 case"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Mann Carroll | Pre-sentence record | Assault by beating | 3rd | Morning | 2 |

    When I click the "Clear all" link

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And There should be no a11y violations

  Scenario: A user wants to filter the list to show only Possible NDelius record offenders and quickly clear the selections
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Possible NDelius record" filter
    And I click the "Probation status" filter button
    And I click the "Apply filters" button

    Then I should see a count of "3 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Guadalupe Hess           | Possible NDelius Record | Assault by beating |     | Morning   | Crown Court 3-1 |
      | Feli'Cia Villa'Rreali'Ty | Possible NDelius Record | Theft from a shop  | 3rd | Afternoon | 2               |

    And I should see the Possible NDelius record badge

    When I click the "Clear all" link

    Then I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    And There should be no a11y violations

  Scenario: Display no matching cases message when no cases are returned due to applied filters
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page

    And I should see a count of "207 cases"

    And I should see the following table headings
      | Defendant | Probation status | Offence | Listing | Session | Court |

    And I should see the following table rows
      | Kara Ayers | No record | Attempt theft from the person of another | 1st | Morning | Crown Court 3-1 |

    When I click the "Probation status" filter button
    And I select the "Current" filter
    And I click the "Probation status" filter button
    And I click the "Courtroom" filter button
    And I select the "06" filter
    And I click the "Courtroom" filter button
    And I click the "Session" filter button
    And I select the "AFTERNOON" filter
    And I click the "Session" filter button
    And I click the "Apply filters" button

    And I should see a count of "0 cases"
    Then I should see the body text "There are no matching cases."
    And There should be no a11y violations
