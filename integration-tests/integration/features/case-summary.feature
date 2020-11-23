Feature: Case summary
  In order to view the of summary of a case sitting on the day in court
  As an authenticated user
  I want to see a case summary view

  Scenario: View the case summary for the given defendant by clicking the link on the case list page
    Given I am an authenticated user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption with the relevant court
    When I click the defendant name "Kara Ayers" link
    Then I should be on the "Case summary" page
    And I should see the heading has the defendant name "Kara Ayers"
    And I should see Back to cases link with href of case list date and page
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant that has not been matched with an existing nDelius record
    Given I am an authenticated user
    When I navigate to the case summary route for case number "3597035492"
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see the heading has the defendant name "Guadalupe Hess"
    And I should see the body text "Probation status: Possible nDelius record"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | possible nDelius records found | Appearance | Offences |

    And I should see court room "7", "morning" session and the "3rd" listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value "Guadalupe Hess"
    Then I should see the row with the key "Gender"
    And I should see the value "Male"
    Then I should see the row with the key "Date of birth"
    And I should see the value "18 February 1989 (31 years old)"
    Then I should see the row with the key "Nationality"
    And I should see the value "Unknown"
    Then I should see the row with the key "Address"
    And I should see the value "43 Hunterfly Place Birmingham AD21 5DR"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with no probation record
    Given I am an authenticated user

    When I navigate to the case summary route for case number "8678951874"
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see the heading has the defendant name "Kara Ayers"
    Then I should see the body text "Probation status: No record"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room "10", "morning" session and the "1st" listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value "Kara Ayers"
    Then I should see the row with the key "Gender"
    And I should see the value "Female"
    Then I should see the row with the key "Date of birth"
    And I should see the value "31 October 1980 (40 years old)"
    Then I should see the row with the key "Nationality"
    And I should see the value "Unknown"
    Then I should see the row with the key "Address"
    And I should see the value "22 Waldorf Court Cardiff AD21 5DR"
    And I should see a button with the label "Link nDelius record"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with an existing probation record
    Given I am an authenticated user

    When I navigate to the case summary route for case number "6627839278"
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the heading has the defendant name "Webb Mitchell"
    Then I should see the body text "CRN: D541487"
    Then I should see the body text "PNC: A/8404713BA"
    Then I should see the body text "Probation status: Previously known"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room "8", "morning" session and the "2nd" listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value "Webb Mitchell"
    Then I should see the row with the key "Gender"
    And I should see the value "Male"
    Then I should see the row with the key "Date of birth"
    And I should see the value "13 October 1958 (62 years old)"
    Then I should see the row with the key "Nationality"
    And I should see the value "Polish"
    Then I should see the row with the key "Address"
    And I should see the value "49 Rochester Avenue Bangor AD21 5DR"
    And I should see a button with the label "Unlink nDelius record"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with a current probation record
    Given I am an authenticated user

    When I navigate to the case summary route for case number "668911253"
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the heading has the defendant name "Lenore Marquez"
    And I should see the body text "CRN: DX12340A"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the body text "Probation status: Current"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room "6", "morning" session and the "2nd" listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value "Lenore Marquez"
    Then I should see the row with the key "Gender"
    And I should see the value "Female"
    Then I should see the row with the key "Date of birth"
    And I should see the value "18 August 1979 (41 years old)"
    Then I should see the row with the key "Nationality"
    And I should see the value "British"
    Then I should see the row with the key "Address"
    And I should see the value "38 Clarendon Road Glasgow AD21 5DR"
    And I should see a button with the label "Unlink nDelius record"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant in breach of a current order
    Given I am an authenticated user

    When I navigate to the case summary route for case number "5222601242"
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the heading has the defendant name "Olsen Alexander"
    And I should see the body text "CRN: D991494"
    And I should see the body text "PNC: D/9874483AB"
    And I should see the body text "Probation status: Current (Breach)"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room "9", "morning" session and the "1st" listing
    And I should see the body text with the defendant offence "Theft from a shop" in bold
    And I should see the body text "On 01/01/2015 at Tetratrex, Leeds, stole ROBOTS to the value of £987.00, belonging to Young Bryant."
    And I should see the caption text "Contrary to section 1(1) and 7 of the Theft Act 1968."

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value "Olsen Alexander"
    Then I should see the row with the key "Gender"
    And I should see the value "Male"
    Then I should see the row with the key "Date of birth"
    And I should see the value "6 June 1996 (24 years old)"
    Then I should see the row with the key "Nationality"
    And I should see the value "British / Swedish"
    Then I should see the row with the key "Address"
    And I should see the value "99 Ralph Avenue London AD21 5DR"
    And I should see a button with the label "Unlink nDelius record"

    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a previously known offender
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption with the relevant court
    When I click the defendant name "Webb Mitchell" link
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date and page
    And I should see the heading has the defendant name "Webb Mitchell"
    When I click the sub navigation with "Probation record" text
    Then I should see the offender previous order count of "5"
    And I should see the following level 2 headings
      | Previous orders | Last pre-sentence report | Last OASys assessment |
    And I should see the last pre-sentence report details for "previouslyKnown" defendant
    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a current offender
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Cases" page

    When I click the defendant name "Lenore Marquez" link
    And I click the sub navigation with "Probation record" text
    Then I should see the offender current order count
    And I should see a link "ORA Community Order (18 Months)" to href "record/1403337513"
    And I should see the licence conditions for the second current order
    And I should see the pss requirements for the third current order
    And I should see the current order offence
    And I should see the current order start date

    And I should see the offender previous order count of "11"
    And I should see link to the first previous order
    And I should see the previous order offence
    And I should see the previous order end date

    And I should see the following level 2 headings
      | Current orders | Previous orders | Offender Manager | Last pre-sentence report | Last OASys assessment |
    And I should see the offender manager name "Angel Extravaganza"
    And I should see the offender manager was allocated on "12 Aug 2017"
    And I should see the last pre-sentence report details for "current" defendant
    And I should see the last OASys assessment details

    And I should see the following level 3 headings
      | Requirements | Post-release status | Licence conditions | Post-release status | Licence conditions | Post-release status | PSS requirements |

    And I should see a limited number of previous orders
    When I click the "Show all previous orders" button
    Then I should see all previous orders
    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order with unpaid work appointments
    Given I am an authenticated user

    When I navigate to the probation record route for case number "668911253"
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name "Lenore Marquez"

    When I click the first "current" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "current" order title
    And I should see the level 2 heading "Attendance"

    And I should see the following level 3 headings
      | Appointments to date | Acceptable | Unacceptable |
    And I should see the body text "Last attended: 4 Mar 2020 - Planned office visit (Acceptable)"

    And I should see the correct start, end and elapsed time headings
    And I should see the "current" order start and end dates
    And I should see the correctly calculated elapsed time for the current order for "current" defendant

    And I should see the appointment attendance information for "current" defendant
    And I should see the unpaid work information for "current" defendant
    And There should be no a11y violations

  Scenario: View the current offender order who is currently on licence
    Given I am an authenticated user

    When I navigate to the current order which is currently on licence
    Then I should be on the "Order details" page

    And I should see the correct licence header details

    And There should be no a11y violations

  Scenario: View the current offender order who is currently on Post Sentence Supervision
    Given I am an authenticated user

    When I navigate to the current order which is currently on PSS
    Then I should be on the "Order details" page

    And I should see the correct PSS header details

    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order in breach without unpaid work appointments
    Given I am an authenticated user

    When I navigate to the probation record route for case number "5222601242"
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name "Olsen Alexander"

    And I should see the last pre-sentence report details for "currentWithBreach" defendant

    And I should see a link "ORA Community Order (18 Months)" to href "record/1361422142"
    And I should see the breach badge
    When I click the first "current" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "current" order title

    And I should see the body text "Abstracting electricity - 04300"
    And I should see the following level 3 headings
      | Appointments to date | Acceptable | Unacceptable |
    And I should see the body text "Last attended: 10 Mar 2020 - Unpaid work (Acceptable)"

    And I should see the correct start, end and elapsed time headings
    And I should see the "currentWithBreach" order start and end dates
    And I should see the correctly calculated elapsed time for the current order for "currentWithBreach" defendant

    And I should see the level 2 heading "Breaches"
    And I should see order breach information

    And I should see the level 2 heading "Attendance"
    And I should see the appointment attendance information for "currentWithBreach" defendant
    And I should see the unpaid work information for "currentWithBreach" defendant

    When I click breach link 1
    Then I should be on the "Breach details" page
    And I should see the correct breach banner for status "Breach initiated"
    And I should see the correct breach heading
    And I should see the level 3 heading "Notes"
    And I should see the body text "Paragraph 1: Some information. Paragraph 2: And some more."
    And I should see the level 3 heading "Attachments"
    And I should see the body text "No attachments have been added."
    And I should see the conviction breach details

    When I click the "Back" link
    And I click breach link 2
    Then I should be on the "Breach details" page
    And I should see the level 3 heading "Notes"
    And I should see the body text "No notes have been added."
    And I should see the level 3 heading "Attachments"
    And I should see the breach document attachments

    And There should be no a11y violations

  Scenario: View the attendance record section of the previous offender order
    Given I am an authenticated user

    When I navigate to the probation record route for case number "668911253"
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name "Lenore Marquez"

    When I click the first "previous" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "previous" order title

    And I should see the body text "Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801"
    And I should see the correct start, ended and reason headings
    And I should see the "previous" order start and end dates
    And I should see the termination date of the previous order and the reason for terminating
    And I should not see the heading level 2 with text "Appointment attendance"
    And I should not see the heading level 2 with text "Unpaid work"
    And There should be no a11y violations

  Scenario: View the case details of a defendant to see a list of current charges and the associated summary/description
    Given I am an authenticated user
    When I navigate to the case summary route for case number "668911253"
    Then I should see the level 2 heading "Offences"
    And If the total number of charges is greater than one
    Then I should see a list of charges in an accordion component
    And I click the first charge accordion button
    Then the accordion section should expand
    And I should see the body text "On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron."
    And I should see the caption text "Contrary to section 1(1) of the Criminal Attempts Act 1981."

  Scenario: View the requirements section of a current order
    Given I am an authenticated user

    When I navigate to the probation record route for case number "668911253"
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name "Lenore Marquez"

    When I click the first "current" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "current" order title
    And I should see the level 2 heading "Requirements"
    And I should see the following table headings
      | Requirement | Length |

  Scenario: View the requirements section of a previous order
    Given I am an authenticated user

    When I navigate to the probation record route for case number "668911253"
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name "Lenore Marquez"

    When I click the first "previous" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "previous" order title
    And I should see the level 2 heading "Requirements"
    And I should see the following table headings
      | Requirement | Length | Ended | Reason |

  Scenario: View the risk register section of the case summary for a previously known offender with risks
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Cases" page

    When I click the defendant name "Webb Mitchell" link
    And I click the sub navigation with "Risk register" text
    Then I should see the risk register table
    And I should see the active registration count for "previouslyKnown" defendant
    And I should see the inactive registration count for "previouslyKnown" defendant
    Then I click the active risk tab
    And I should see the level 2 heading 'Active registrations'
    And I should see the following table headings
      | Type | Registered | Next review | Notes |
    Then I click the inactive risk tab
    And I should see the level 2 heading 'Inactive registrations'
    And I should see the following table headings
      | Type | Registered | Next review | Notes |

    And There should be no a11y violations

  Scenario: View the risk register section of the case summary for a current offender with no risks
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Cases" page

    When I click the defendant name "Olsen Alexander" link
    And I click the sub navigation with "Risk register" text
    Then I should see the risk register table
    And I should see the active registration count for "current" defendant
    And I should see the inactive registration count for "current" defendant
    Then I click the active risk tab
    And I should see the body text "There are no active registrations"
    Then I click the inactive risk tab
    And I should see the body text "There are no inactive registrations"

    And There should be no a11y violations
