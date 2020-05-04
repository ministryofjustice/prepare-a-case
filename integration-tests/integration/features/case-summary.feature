Feature: Case summary
  In order to view the of summary of a case sitting on the day in court
  As a registered user
  I want to see a case summary view

  Scenario: View the case summary for the given defendant by clicking the link on the case list page
    Given I am a registered user
    And I am looking at a not known defendant
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption "Sheffield Magistrates' Court"
    When I click the defendant name link
    Then I should be on the "Case details" page
    And I should see the heading has the defendant name
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with no probation record
    Given I am a registered user
    And I am looking at a not known defendant

    When I navigate to the case details route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details |
    And I should see the heading has the defendant name
    And I should see the body text "Date of birth:" and the defendant "dateOfBirth"
    And I should see the body text "PNC:" and the defendant "pnc"
    Then I should see the body text "Probation status: No record"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |

    And I should see court room, session and the correct listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"

    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with an existing probation record
    Given I am a registered user
    And I am looking at a previously known defendant

    When I navigate to the case details route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Probation record | Risk registers |
    And I should see the heading has the defendant name
    And I should see the body text "Date of birth:" and the defendant "dateOfBirth"
    And I should see the body text "CRN:" and the defendant "crn"
    And I should see the body text "PNC:" and the defendant "pnc"
    Then I should see the body text "Probation status: Previously known"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |

    And I should see court room, session and the correct listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"

    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with a current probation record
    Given I am a registered user
    And I am looking at a current defendant

    When I navigate to the case details route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Probation record | Risk registers |
    And I should see the heading has the defendant name
    And I should see the body text "Date of birth:" and the defendant "dateOfBirth"
    And I should see the body text "CRN:" and the defendant "crn"
    And I should see the body text "PNC:" and the defendant "pnc"
    And I should see the body text "Probation status: Current"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |

    And I should see court room, session and the correct listing
    Then I should see a list of charges in an accordion component

    And I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value with defendant "name"
    Then I should see the row with the key "Gender"
    And I should see the value with defendant "gender"
    Then I should see the row with the key "Date of birth"
    And I should see the value with defendant "dateOfBirth"
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"

    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant in breach of a current order
    Given I am a registered user
    And I am looking at a current defendant with breach

    When I navigate to the case details route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Probation record | Risk registers |
    And I should see the heading has the defendant name
    And I should see the body text "Date of birth:" and the defendant "dateOfBirth"
    And I should see the body text "CRN:" and the defendant "crn"
    And I should see the body text "PNC:" and the defendant "pnc"
    And I should see the body text "Probation status: Current (Breach)"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |

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
    Then I should see the row with the key "Address"
    And I should see the value with defendant "address"
    Then I should see the row with the key "Nationality"
    And I should see the value with defendant "nationality"

    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a previously known offender
    Given I am a registered user
    And I am looking at a previously known defendant

    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption "Sheffield Magistrates' Court"
    When I click the defendant name link
    Then I should be on the "Case details" page
    And I should see the heading has the defendant name
    When I click the sub navigation with "Probation record" text
    Then I should see the offender previous order count
    And I should see the following level 3 headings
      | Offender Manager |
    And I should see the offender manager details
    And I should see link to the first previous order
    And I should see the previous order offence
    And I should see the previous order end date
    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a current offender
    Given I am a registered user
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
      | Requirements | Offender Manager |
    And I should see the offender manager details
    And I should see the last pre-sentence report details
    And I should see a limited number of previous orders
    When I click the "Show all previous orders" button
    Then I should see all previous orders
    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order with unpaid work appointments
    Given I am a registered user
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
      | Appointments to date | Complied | Failures to comply | Awaiting outcome |
    And I should see the body text "Last attendance:" and the defendant "currentOrderLastAttendance"

    And I should see the correct start, end and elapsed time headings
    And I should see the "current" order start and end dates
    And I should see the correctly calculated elapsed time for the current order

    And I should see the appointment attendance information
    And I should see the unpaid work information
    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order without unpaid work appointments
    Given I am a registered user
    And I am looking at a current defendant with breach

    When I navigate to the probation record route
    Then I should be on the "Probation record" page
    And I should see the heading has the defendant name

    When I click the first "current" order link
    Then I should be on the "Order details" page
    And I should see the level 2 heading with the "current" order title
    And I should see the level 2 heading "Appointment attendance"

    And I should see the body text with the defendant "currentOrderOffence"
    And I should see the following level 3 headings
      | Appointments to date | Complied | Failures to comply | Awaiting outcome |
    And I should see the body text "Last attendance:" and the defendant "currentOrderLastAttendance"

    And I should see the correct start, end and elapsed time headings
    And I should see the "current" order start and end dates
    And I should see the correctly calculated elapsed time for the current order

    And I should see the appointment attendance information
    And I should see the unpaid work information
    And There should be no a11y violations

  Scenario: View the attendance record section of the previous offender order
    Given I am a registered user
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

  Scenario: View the case details of a defendant to see a list of current charges and the associated details/description
    Given I am a registered user
    When I navigate to the case details route
    Then I should see the level 2 heading "Offences"
    And If the total number of charges is greater than one
    Then I should see a list of charges in an accordion component
    And I click the "Attempt theft from the person of another" button
    Then the accordion section should expand
    And I should see the body text with the defendant "offenceDetails"
    And I should see the caption text with the defendant "offenceCaption"

    Scenario: View the requirements section of a current order
      Given I am a registered user
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
      Given I am a registered user
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




