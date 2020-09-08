Feature: Case summary
  In order to view the of summary of a case sitting on the day in court
  As an authenticated user
  I want to see a case summary view

  Scenario: View the case summary for the given defendant by clicking the link on the case list page
    Given I am an authenticated user
    And I am looking at a not known defendant
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption with the relevant court
    When I click the defendant name link
    Then I should be on the "Case summary" page
    And I should see the heading has the defendant name
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant that has not been matched with an existing nDelius record
    Given I am an authenticated user
    And I am looking at a not matched defendant

    When I navigate to the case summary route
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see the heading has the defendant name
    And I should see the body text "Probation status: Possible nDelius record"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | possible nDelius records found | Appearance | Offences |

    And I should see court room, session and the correct listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with no probation record
    Given I am an authenticated user
    And I am looking at a not known defendant

    When I navigate to the case summary route
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see the heading has the defendant name
    Then I should see the body text "Probation status: No record"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room, session and the correct listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"
    And I should see a button with the label "Link nDelius record"
    
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with an existing probation record
    Given I am an authenticated user
    And I am looking at a previously known defendant

    When I navigate to the case summary route
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the heading has the defendant name
    And I should see the body text "CRN:" and the defendant "crn"
    And I should see the body text "PNC:" and the defendant "pnc"
    Then I should see the body text "Probation status: Previously known"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room, session and the correct listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"
    And I should not see a button with the label "Link nDelius record"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with a current probation record
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the case summary route
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the heading has the defendant name
    And I should see the body text "CRN:" and the defendant "crn"
    And I should see the body text "PNC:" and the defendant "pnc"
    And I should see the body text "Probation status: Current"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room, session and the correct listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"
    And I should not see a button with the label "Link nDelius record"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant in breach of a current order
    Given I am an authenticated user
    And I am looking at a current defendant with breach

    When I navigate to the case summary route
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the heading has the defendant name
    And I should see the body text "CRN:" and the defendant "crn"
    And I should see the body text "PNC:" and the defendant "pnc"
    And I should see the body text "Probation status: Current (Breach)"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |

    And I should see court room, session and the correct listing
    And I should see the body text with the defendant "offence" in bold
    And I should see the body text with the defendant "offenceDetails"
    And I should see the caption text with the defendant "offenceCaption"

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"

    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a previously known offender
    Given I am an authenticated user
    And I am looking at a previously known defendant

    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption with the relevant court
    When I click the defendant name link
    Then I should be on the "Case summary" page
    And I should see Back to cases link with href of case list date
    And I should see the heading has the defendant name
    When I click the sub navigation with "Probation record" text
    Then I should see the offender previous order count
    And I should see the following level 3 headings
      | Offender Manager |
    And I should see the offender manager details
    And I should see link to the first previous order
    And I should see the previous order offence
    And I should see the previous order end date
    And I should see the last pre-sentence report details
    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a current offender
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the "cases" route
    Then I should be on the "Cases" page

    When I click the defendant name link
    And I click the sub navigation with "Probation record" text
    Then I should see the offender current order count
    And I should see link to the first current order
    And I should see the requirements for the first current order
    And I should see the current order offence
    And I should see the current order start date

    And I should see the offender previous order count
    And I should see link to the first previous order
    And I should see the previous order offence
    And I should see the previous order end date

    And I should see the following level 3 headings
      | Requirements | Requirements | Requirements | Offender Manager |
    And I should see the offender manager details
    And I should see the last pre-sentence report details
    And I should see the last OASys assessment details
    And I should see a limited number of previous orders
    When I click the "Show all previous orders" button
    Then I should see all previous orders
    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order with unpaid work appointments
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the probation record route
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name

    When I click the first "current" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "current" order title
    And I should see the level 2 heading "Appointment attendance"

    And I should see the body text with the defendant "currentOrderOffence"
    And I should see the following level 3 headings
      | Appointments to date | Complied | Failures to comply |
    And I should see the body text "Last attended" and the defendant "currentOrderLastAttendance"

    And I should see the correct start, end and elapsed time headings
    And I should see the "current" order start and end dates
    And I should see the correctly calculated elapsed time for the current order

    And I should see the appointment attendance information
    And I should see the unpaid work information
    And There should be no a11y violations

  Scenario: View the current offender order who is currently on licence
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the current order which is currently on licence
    Then I should be on the "Order details" page

    And I should see the correct licence header details

    And There should be no a11y violations

  Scenario: View the current offender order who is currently on Post Sentence Supervision
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the current order which is currently on PSS
    Then I should be on the "Order details" page

    And I should see the correct PSS header details

    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order in breach without unpaid work appointments
    Given I am an authenticated user
    And I am looking at a current defendant with breach

    When I navigate to the probation record route
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name

    And I should see the last pre-sentence report details

    And I should see link to the first current order
    When I click the first "current" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "current" order title

    And I should see the body text with the defendant "currentOrderOffence"
    And I should see the following level 3 headings
      | Appointments to date | Complied | Failures to comply |
    And I should see the body text "Last attended" and the defendant "currentOrderLastAttendance"

    And I should see the correct start, end and elapsed time headings
    And I should see the "current" order start and end dates
    And I should see the correctly calculated elapsed time for the current order

    And I should see the level 2 heading "Breaches"
    And I should see order breach information

    And I should see the level 2 heading "Appointment attendance"
    And I should see the appointment attendance information
    And I should see the unpaid work information

    When I click breach link 1
    Then I should be on the "Breach details" page
    And I should see the breach banner
    And I should see the correct breach heading
    And I should see the level 3 heading "Attachments"
    And I should see the body text "No attachments have been added."
    And I should see the conviction breach details

    When I click the "Back" link
    And I click breach link 2
    Then I should be on the "Breach details" page
    And I should see the level 3 heading "Attachments"
    And I should see the breach document attachments

    And There should be no a11y violations

  Scenario: View the attendance record section of the previous offender order
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the probation record route
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name

    When I click the first "previous" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "previous" order title

    And I should see the body text with the defendant "previousOrderOffence"
    And I should see the correct start, ended and reason headings
    And I should see the "previous" order start and end dates
    And I should see the termination date of the previous order and the reason for terminating
    And I should not see the heading level 2 with text "Appointment attendance"
    And I should not see the heading level 2 with text "Unpaid work"
    And There should be no a11y violations

  Scenario: View the case details of a defendant to see a list of current charges and the associated summary/description
    Given I am an authenticated user
    And I am looking at a current defendant
    When I navigate to the case summary route
    Then I should see the level 2 heading "Offences"
    And If the total number of charges is greater than one
    Then I should see a list of charges in an accordion component
    And I click the first charge accordion button
    Then the accordion section should expand
    And I should see the body text with the defendant "offenceDetails"
    And I should see the caption text with the defendant "offenceCaption"

  Scenario: View the requirements section of a current order
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the probation record route
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name

    When I click the first "current" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "current" order title
    And I should see the level 2 heading "Requirements"
    And I should see the following table headings
      | Requirement | Length |

  Scenario: View the requirements section of a previous order
    Given I am an authenticated user
    And I am looking at a current defendant

    When I navigate to the probation record route
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name

    When I click the first "previous" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "previous" order title
    And I should see the level 2 heading "Requirements"
    And I should see the following table headings
      | Requirement | Length | Ended | Reason |
