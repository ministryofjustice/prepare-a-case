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
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the body text with the defendant "offence" in bold
    And I should see the body text with the defendant "offenceDetails"
    And I should see the caption text with the defendant "offenceCaption"

  Scenario: View the case summary for the given defendant with an existing probation record
    Given I am a registered user
    And I am looking at a current defendant with breach
    When I navigate to the case details route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Probation record | Risk registers |
    And I should see the heading has the defendant name
    And I should see the body text "Date of birth: 13th October 1958"
    And I should see the body text "CRN: D541487"
    And I should see the body text "PNC: A/8404713BA"
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the body text "Theft from the person of another" in bold
    And I should see the body text "On 24/03/2016 at Edinburgh stole PLAYSTATION 4 to the value of 300.00, belonging to Dillard Everett."
    And I should see the caption text "Contrary to section 1(1) and 7 of the Theft Act 1968."

  Scenario: View the case summary for the given defendant with a current probation record and risk of serious harm
    Given I am a registered user
    When I navigate to the "case/668911253/details" route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Probation record | Risk registers |
    And I should see the heading "Lenore Marquez"
    And I should see the body text "Date of birth: 18th August 1979"
    And I should see the body text "CRN: DX12340A"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the body text "Attempt theft from the person of another" in bold
    And I should see the body text "On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron."
    And I should see the caption text "Contrary to section 1(1) of the Criminal Attempts Act 1981."
    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a previously known offender by clicking the defendant link from the case list page
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption "Sheffield Magistrates' Court"
    When I click the "Webb Mitchell" link
    Then I should be on the "Case details" page
    And I should see the heading "Webb Mitchell"
    When I click the sub navigation with "Probation record" text
    Then I should see the following level 2 headings
      | Previous orders (5) |
    And I should see the following level 3 headings
      | Offender Manager |
    And I should see the body text "Not active"
    And I should see link "CJA - Indeterminate Public Prot." with href "record/1531139839"

  Scenario: View the probation record section of the case summary for a current offender by clicking the defendant link from the case list page
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption "Sheffield Magistrates' Court"
    When I click the "Lenore Marquez" link
    Then I should be on the "Case details" page
    And I should see the heading "Lenore Marquez"
    When I click the sub navigation with "Probation record" text
    Then I should see the following level 2 headings
      | Current orders (5) | Previous orders (11) |
    And I should see the following level 3 headings
      | Offender Manager |
    And I should see the body text "Mcmahon Buchanan"
    And I should see the hint text "Allocated on 12 Aug 2017"
    And I should see the body text "NPS West Yorkshire Ecolight Towers 71 Ocean Parkway Leeds West Yorkshire LS7 4JP"
    And I should see the body text "Telephone: 01890 547 292"
    And I should see link "ORA Adult Custody (inc PSS)" with href "record/1403337513"
    And I should see the body text "Stealing mail bags or postal packets or unlawfully taking away or opening mail bag - 04200"
    And I should see link "CJA - Std Determinate Custody" with href "record/2788607022"
    And I should see the hint text "Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801"

  Scenario: View the attendance record section of the current offender order ORA Adult Custody (inc PSS)
    Given I am a registered user
    When I navigate to the "case/668911253/record" route
    Then I should be on the "Probation record" page
    And I should see the heading "Lenore Marquez"
    When I click the "ORA Adult Custody (inc PSS)" link
    Then I should be on the "Order details" page
    Then I should see the following level 2 headings
      | ORA Adult Custody (inc PSS) | Appointment attendance |
    And I should see the body text "Stealing mail bags or postal packets or unlawfully taking away or opening mail bag - 04200"
    And I should see the following level 3 headings
      | Appointments to date | Complied | Failures to comply | Awaiting outcome |
    And I should see the body text "Last attendance: 4 Mar 2020 - Planned office visit (Attended - Complied)"
    And I should see the text "19 May 2019" within element with class "qa-start-date"
    And I should see the text "25 May 2020" within element with class "qa-end-date"
    And I should see the correct time elapsed between "2019-05-19" and "2020-05-25"
    And I should see the following elements with "app-dashboard-count" class text
      | 10 | 6 | 2 | 2 | 1 | 1 | 0 | 1 | 1 | 2 | 2 | 1 |
    And I should see the body text "Attendances"
    And I should see the body text "Planned office visit"
    And I should see the body text "Unpaid work"
    And I should see the body text "Appointment with External Agency"
    And I should see the body text "IAPS / Accredited programme"

  Scenario: View the attendance record section of the previous offender order CJA - Std Determinate Custody
    Given I am a registered user
    When I navigate to the "case/668911253/record" route
    Then I should be on the "Probation record" page
    And I should see the heading "Lenore Marquez"
    When I click the "CJA - Std Determinate Custody" link
    Then I should be on the "Order details" page
    Then I should see the following level 2 headings
      | CJA - Std Determinate Custody |
    And I should see the body text "Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801"
    And I should see the text "8 Mar 2017" within element with class "qa-start-date"
    And I should see the text "2 Jan 2018" within element with class "qa-end-date"
    And I should not see the heading level 2 with text "Appointment attendance"

  Scenario: View the case details to see the probation status and PNC/CRN numbers of a defendant currently known to probation
    Given I am a registered user
    When I navigate to the "case/668911253/details" route
    Then I should see a key details banner with a level 1 heading "Lenore Marquez"
    And I should see the body text "CRN: DX12340A"
    And I should see a straight line divide
    And I should see the body text "PNC: A/1234560BA"
    Then I should see the body text "Probation status: Current"

  Scenario: View the case details to see the probation status and PNC/CRN numbers of a defendant currently known to probation and in breach of their order
    Given I am a registered user
    When I navigate to the "case/5222601242/details" route
    Then I should see a key details banner with a level 1 heading "Olsen Alexander"
    And I should see the body text "CRN: D991494"
    And I should see a straight line divide
    And I should see the body text "PNC: D/9874483AB"
    Then I should see the body text "Probation status: Current (Breach)"

  Scenario: View the case details to see the probation status and PNC/CRN numbers of a defendant previously known to probation
    Given I am a registered user
    When I navigate to the "case/381157762/details" route
    Then I should see a key details banner with a level 1 heading "Jannie Mcbride"
    And I should see a straight line divide
    And I should see the body text "PNC: A/1234560BA"
    Then I should see the body text "Probation status: Previously known"

  Scenario: View the case details to see the probation status and PNC/CRN numbers of a defendant with a probation status of no record
    Given I am a registered user
    When I navigate to the "case/3597035492/details" route
    Then I should see a key details banner with a level 1 heading "Guadalupe Hess"
    And I should see a straight line divide
    And I should see the body text "PNC: A/1234560BA"
    Then I should see the body text "Probation status: No record"

  Scenario: View the case details to see the personal details of a defendant appearing in court
    Given I am a registered user
    When I navigate to the "case/3597035492/details" route
    Then I should see the level 2 heading "Appearance"
    Then I should see the session is in Court "7" this morning with "3rd" listing
    Then I should see the level 2 heading "Personal details from police"
    Then I should see a summary list
    And I should see the row with the key "Name"
    And I should see the value "Guadalupe Hess"
    Then I should see the row with the key "Gender"
    And I should see the value "Female"
    Then I should see the row with the key "Date of birth"
    And I should see the value "12 May 1979 (40 years old)"
    Then I should see the row with the key "Address"
    And I should see the value "43 Hunterfly Place Birmingham AD21 5DR"
    Then I should see the row with the key "Nationality"
    And I should see the value "Unknown"
