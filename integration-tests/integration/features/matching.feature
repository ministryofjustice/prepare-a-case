Feature: Matching defendants to nDelius records
  In order to match defendants to probation records
  As an authenticated user
  I want to be able to confirm existing probation records match with defendants appearing in court

  Scenario: View the list of defendants with possible probation record matches for a given day in court
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"

    And I should see the heading "Defendants with possible NDelius records"

    And I should see medium heading with text "2 defendants partially match with existing records."
    And I should see the body text "Review and confirm the correct record for each defendant."

    And I should see the following table headings
      | Defendant | NDelius records found | Action |
    And I should see the following table rows
      | Guadalupe Hess          | 3 | Review records |
      | Feli'Cia Villa'Rreali'Ty | 2 | Review records |

    And I should see link "Review records" in position 2 with href "/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730"
    And I should see link "Review records" in position 3 with href "/B14LO/case/07fe9ad9-ee10-4460-9683-a81d5316334e/hearing/ca37749f-d020-4cb0-b7fa-d08f632f2f31/match/defendant/43314cc3-cec6-4a77-9ecd-34554f581c85"

    And There should be no a11y violations

  Scenario: View the list of possible NDelius records
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    And I should see the heading "Defendants with possible NDelius records"

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I should see the heading "Guadalupe Paratroop Flowerlupe Hess"
    And I should see the level 2 heading "Review possible NDelius records"
    And I should see the body text "Compare details and confirm the correct record for the defendant."
    And I should see the inset text "Details that match the defendant are highlighted."

    Then I should see the level 3 heading "Defendant details"
    And I should see the legend "3 NDelius records found"

    And I should see the following table headings
      | Name | Date of birth | Address | PNC |
    And I should see the following table rows
      | Guadalupe Paratroop Flowerlupe Hess      |
      | 18 February 1989                         |
      | 43 Hunterfly Place, Birmingham, AD21 5DR |
      | Unavailable                              |
    And I should see the following table 2 headings
      | Name | Date of birth | Address | PNC | CRN | Probation status | Most recent event |
    And I should see the following table 2 rows
      | Guadalupe Flowerlupe Paratroop Hess                            |
      | 18 February 1989                                               |
      | 43 Hunterfly Place, Birmingham, Birmingham, AD21 5DR           |
      | D/9874483AB                                                    |
      | V178657                                                        |
      | Current                                                        |
      | 27 November 2017 - CJA Standard Determinate Custody (6 Months) |
    And I should see the following table 3 rows
      | Guadalupe Paul Hess                                             |
      | 18 February 1989                                                |
      | Dunroamin, Leicestershire, LE2 3NA                              |
      | Unavailable                                                     |
      | C178657                                                         |
      | Previously known                                                |
      | 27 November 2017 - CJA Standard Determinate Custody (12 Months) |
    And I should see the following table 4 rows
      | Guadalupe Flowerlupe Hess                                     |
      | 18 February 1998                                              |
      | Dunroamin, Leicestershire, LE2 3NA                            |
      | Unavailable                                                   |
      | B123456                                                       |
      | Previously known                                              |
      | 13 January 2015 - CJA Standard Determinate Custody (6 Months) |
    And I should see radio buttons with the following IDs
      | defendant-1 | defendant-2 | defendant-3 |

    And There should be no a11y violations

  Scenario: View the list of possible NDelius records highlighted
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    And I should see the heading "Defendants with possible NDelius records"
    And I should see the following table headings
      | Defendant | NDelius records found | Action |
    And I should see the following table rows
      | Guadalupe Hess          | 3 | Review records |
      | Feli'Cia Villa'Rreali'Ty | 2 | Review records |

    Then I navigate to the "/B14LO/case/07fe9ad9-ee10-4460-9683-a81d5316334e/hearing/ca37749f-d020-4cb0-b7fa-d08f632f2f31/match/defendant/43314cc3-cec6-4a77-9ecd-34554f581c85" base route

    And I should see the heading "Felicia Blob Popop Villareal"
    And I should see the level 2 heading "Review possible NDelius records"
    And I should see the body text "Compare details and confirm the correct record for the defendant."
    And I should see the inset text "Details that match the defendant are highlighted."

    Then I should see the level 3 heading "Defendant details"
    And I should see the legend "2 NDelius records found"

    And I should see the following table headings
      | Name | Date of birth | Address | PNC |
    And I should see the following table rows
      | Felicia Blob Popop Villareal    |
      | 13 August 1980                  |
      | 37 Maple Avenue, London, L1 5DR |
      | A/1234560BA                     |
    And I should see the following table 2 headings
      | Name | Date of birth | Address | PNC | CRN | Probation status | Most recent event |
    And I should see the following table 2 rows
      | Felicia Consuela Villarreal                                    |
      | 26 August 1971                                                 |
      | 20 Main Street Shangri La, Leicester, Leicestershire, LE2 1BG  |
      | A/1234560BA                                                    |
      | V178657                                                        |
      | Current                                                        |
      | 27 November 2017 - CJA Standard Determinate Custody (6 Months) |
    And I should see the following table 3 rows
      | Felecia Conswela Vilareel                                       |
      | 26 August 1969                                                  |
      | Dunroamin, Leicestershire, LE2 3NA                              |
      | A/1234560BA                                                     |
      | C178657                                                         |
      | Previously known                                                |
      | 27 November 2017 - CJA Standard Determinate Custody (12 Months) |

    And I should see radio buttons with the following IDs
      | defendant-1 | defendant-2 |

    And There should be no a11y violations

  Scenario: Display an error message if the user does not select a radio button when confirming a match
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    When I click the "Confirm record" button
    Then I should see the error message "Select an NDelius record"

    And There should be no a11y violations

  Scenario: Confirm defendant record match from bulk match list
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I click the element with id "defendant-1"
    And I click the "Confirm record" button

    Then I should be on the "Defendants with possible NDelius records" page
    And I should see the match confirmation banner message "You have successfully confirmed a record for Guadalupe Hess"

    And There should be no a11y violations

  Scenario: Confirm defendant record match from case summary
    Given I am an authenticated user
    When I navigate to the "/B14LO/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/summary" base route
    And I click the "Review records" link

    Then I should be on the "Review possible NDelius records" page

    When I click the element with id "defendant-1"
    And I click the "Confirm record" button

    Then I should be on the "Case summary" page
    And I should see the match confirmation banner message "You have successfully confirmed a record for Guadalupe Hess"

    And There should be no a11y violations

  Scenario: Confirm no existing defendant record match from bulk list
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "confirm they have no record" link

    Then I should be on the "Defendants with possible NDelius records" page
    And I should see the match confirmation banner message "You have successfully confirmed Guadalupe Hess has no NDelius record."

    And There should be no a11y violations

  Scenario: Click the back button on matching screen when starting the journey at case summary
    Given I am an authenticated user
    When I navigate to the "/B14LO/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/summary" base route
    And I click the "Review records" link

    Then I should be on the "Review possible NDelius records" page
    When I click the "Back" link
    Then I should be on the "Case summary" page

    And There should be no a11y violations

  Scenario: Click the back button on matching screen when starting the journey at match from bulk list
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    When I click the "Back" link
    Then I should be on the "Defendants with possible NDelius records" page

    And There should be no a11y violations

  Scenario: Manually match a defendant and submit without entering a CRN
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link

    Then I should be on the "Link an NDelius record to the defendant" page
    And I should see the body text "Use a case reference number (CRN) to link to an existing NDelius record to the defendant."
    And I should see the level 2 heading "Defendant details"
    And I should see the following summary list 1 with keys
      | Name | Date of birth |
    And I should see the level 3 heading "Enter the CRN of the existing record"
    And I should see the text input label "Case reference number (CRN)"
    And I should see the text input with id "crn"
    And I should see the text input hint "For example, A123456"
    When I click the "Find record" button

    Then I should be on the "Link an NDelius record to the defendant" page
    Then I should see the error message "Enter a case reference number"

    And There should be no a11y violations

  Scenario: Manually match a defendant and submit with an invalid CRN
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link

    Then I should be on the "Link an NDelius record to the defendant" page
    When I enter "INVALID" into text input with id "crn"
    And I click the "Find record" button

    Then I should be on the "Link an NDelius record to the defendant" page
    Then I should see the error message "CRN must be in the correct format"

    And There should be no a11y violations

  Scenario: Manually match a defendant and submit with a valid but incorrect CRN
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link

    Then I should be on the "Link an NDelius record to the defendant" page
    When I enter "B654321" into text input with id "crn"
    And I click the "Find record" button

    Then I should be on the "Link an NDelius record to the defendant" page
    Then I should see the error message "No records match the CRN"

    And There should be no a11y violations

  Scenario: Manually match a defendant and submit with a valid CRN with Limited Access Markers
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link

    Then I should be on the "Link an NDelius record to the defendant" page
    When I enter "F611234" into text input with id "crn"
    And I click the "Find record" button

    Then I should be on the "Link an NDelius record to the defendant" page
    Then I should see the error message "You are restricted from viewing this NDelius record"

    And There should be no a11y violations

  Scenario: Manually match a defendant from the bulk list
    Given I am an authenticated user
    When I navigate to the "/B14LO/match/bulk" base route for today
    Then I should be on the "Defendants with possible NDelius records" page

    When I click the "Review records" link
    Then I should be on the "Review possible NDelius records" page

    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link

    Then I should be on the "Link an NDelius record to the defendant" page
    And I should not see the key details banner
    And I should see link "Cancel" with href "/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730"
    When I enter "C178657" into text input with id "crn"
    And I click the "Find record" button

    Then I should be on the "Link an NDelius record to the defendant" page
    And I should see the body text "Use a case reference number (CRN) to link to an existing NDelius record to the defendant."
    And I should see the level 2 heading "Defendant details"
    And I should see the following summary list 1 with keys
      | Name | Date of birth |
    And I should see the level 3 heading "NDelius record found"
    And I should see the following summary list 2 with keys
      | Name | Date of birth | CRN | PNC | Probation status |
    When I click the "Link record to defendant" button

    Then I should be on the "Defendants with possible NDelius records" page
    And I should see the match confirmation banner message "You have successfully linked an NDelius record to Guadalupe Hess."

    And There should be no a11y violations

  Scenario: Manually match a defendant from the case list
    Given I am an authenticated user
    When I navigate to the "/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730" base route

    And I click the element with id "defendant-1"
    And I click the "Can't see the correct record?" summary link
    And I click the "link it to them with a case reference number" link

    Then I should be on the "Link an NDelius record to the defendant" page
    And I should see the key details banner
    And I should see link "Cancel" with href "/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730"
    When I enter "C178657" into text input with id "crn"
    And I click the "Find record" button

    Then I should be on the "Link an NDelius record to the defendant" page
    And I should see back link "Back" with href "/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730"
    And I should see the body text "Use a case reference number (CRN) to link to an existing NDelius record to the defendant."
    And I should see the level 2 heading "Defendant details"
    And I should see the following summary list 1 with keys
      | Name | Date of birth |
    And I should see the level 3 heading "NDelius record found"
    And I should see the following summary list 2 with keys
      | Name | Date of birth | CRN | PNC | Probation status |
    When I click the "Link record to defendant" button

    Then I should be on the "Case summary" page
    And I should see the match confirmation banner message "You have successfully linked an NDelius record to Guadalupe Hess."

    And There should be no a11y violations

  Scenario: Manually match a defendant and choose to search again
    Given I am an authenticated user
    When I navigate to the "/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/confirm/C178657" base route

    Then I should be on the "Link an NDelius record to the defendant" page
    And I should see the body text "Use a case reference number (CRN) to link to an existing NDelius record to the defendant."
    And I should see the level 2 heading "Defendant details"
    And I should see the following summary list 1 with keys
      | Name | Date of birth |
    And I should see the level 3 heading "NDelius record found"
    When I click the "search again" link

    Then I should be on the "Link an NDelius record to the defendant" page
    And I should see the level 3 heading "Enter the CRN of the existing record"

    And There should be no a11y violations

  Scenario: Confirm no existing defendant record match from case summary
    Given I am an authenticated user
    When I navigate to the "/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730" base route

    And I click the "Can't see the correct record?" summary link
    And I click the "confirm they have no record" link

    Then I should be on the "Case summary" page
    And I should see the match confirmation banner message "You have successfully confirmed Guadalupe Hess has no NDelius record."

    And There should be no a11y violations

  Scenario: Attempt to confirm match but encounter a server error
    Given I am an authenticated user
    When I navigate to the "/B14LO/case/07fe9ad9-ee10-4460-9683-a81d5316334e/hearing/ca37749f-d020-4cb0-b7fa-d08f632f2f31/match/defendant/43314cc3-cec6-4a77-9ecd-34554f581c85" base route

    And I click the element with id "defendant-1"
    And I click the "Confirm record" button

    Then I should be on the "Review possible NDelius records" page

    And I should see the match confirmation banner message "Something went wrong - try again."

  Scenario: Link an NDelius record to a not known defendant from case-summary
    Given I am an authenticated user
    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route

    And I click the "Link NDelius record" button
    Then I should be on the "Link an NDelius record to the defendant" page
    And I should see back link "Back" with href "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary"
    And I should see link "Cancel" with href "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary"

    And There should be no a11y violations

  Scenario: Link an NDelius record to a not known defendant from case-summary
    Given I am an authenticated user
    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route

    And I click the "Link NDelius record" button
    Then I should be on the "Link an NDelius record to the defendant" page

    And There should be no a11y violations

  Scenario: Unlink NDelius record from the defendant
    Given I am an authenticated user
    When I navigate to the "/B14LO/hearing/3f80d674-d964-4781-927a-99c78bc340e2/defendant/062c670d-fdf6-441f-99e1-d2ce0c3a3846/summary" base route

    Then I should be on the "Case summary" page
    When I click the "Unlink NDelius record" button

    Then I should be on the "Unlink NDelius record from the defendant" page
    When I click the "Unlink record from defendant" button

    Then I should be on the "Case summary" page
    And I should see the match confirmation banner message "You have successfully unlinked an NDelius record from Charlene Hammond."

    And There should be no a11y violations

  Scenario: Visit the unlink NDelius record from the defendant page and click the back button
    Given I am an authenticated user
    When I navigate to the "/B14LO/hearing/3f80d674-d964-4781-927a-99c78bc340e2/defendant/062c670d-fdf6-441f-99e1-d2ce0c3a3846/summary" base route

    Then I should be on the "Case summary" page
    When I click the "Unlink NDelius record" button

    Then I should be on the "Unlink NDelius record from the defendant" page
    When I click the "Back" link

    Then I should be on the "Case summary" page

    And There should be no a11y violations
