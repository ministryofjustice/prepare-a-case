Feature: Case summary
  In order to view the of summary of a case sitting on the day in court
  As a registered user
  I want to see a case summary view

  Scenario: View the case summary for the given defendant by clicking the link on the case list page
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption "Sheffield Magistrates' Court"
    When I click the "Kara Ayers" link
    Then I should be on the "Case details" page
    And I should see the heading "Kara Ayers"

  Scenario: View the case summary for the given defendant with no probation record
    Given I am a registered user
    When I navigate to the "case/8678951874/details" route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Personal details |
    And I should see the heading "Kara Ayers"
    And I should see the body text "Date of birth: 31/10/1980"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the session is in Court "10" this morning
    And I should see the body text "Assault by beating" in bold
    And I should see the body text "On 01/01/2016 at Newcastle assaulted Short Pearson by beating him."
    And I should see the caption text "Contrary to section 39 of the Criminal Justice Act 1988."
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with an existing probation record
    Given I am a registered user
    When I navigate to the "case/6627839278/details" route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Personal details | Probation record | Risk registers |
    And I should see the heading "Webb Mitchell"
    And I should see the body text "Date of birth: 13/10/1958"
    And I should see the body text "CRN: D541487"
    And I should see the body text "PNC: A/8404713BA"
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the session is in Court "8" this morning
    And I should see the body text "Theft from the person of another" in bold
    And I should see the body text "On 24/03/2016 at Edinburgh stole PLAYSTATION 4 to the value of 300.00, belonging to Dillard Everett."
    And I should see the caption text "Contrary to section 1(1) and 7 of the Theft Act 1968."
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with a current probation record and risk of serious harm
    Given I am a registered user
    When I navigate to the "case/668911253/details" route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Personal details | Probation record | Risk registers |
    And I should see the heading "Lenore Marquez"
    And I should see the body text "Date of birth: 18/08/1979"
    And I should see the body text "CRN: DX12340A"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the following alerts
      | Medium Risk of Serious Harm | Current offender |
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the session is in Court "6" this morning
    And I should see the body text "Attempt theft from the person of another" in bold
    And I should see the body text "On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron."
    And I should see the caption text "Contrary to section 1(1) of the Criminal Attempts Act 1981."
    And There should be no a11y violations

  Scenario: View the person section of the case summary for a defendant with no probation record by clicking the defendant link from the case list page
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption "Sheffield Magistrates' Court"
    When I click the "Kara Ayers" link
    Then I should be on the "Case details" page
    And I should see the heading "Kara Ayers"
    When I click the sub navigation with "Personal details" text
    Then I should see the following level 2 headings
      | Personal details from charge |
    And I should see the "first" summary table
      | Name          | Kara Ayers                        |
      | Gender        | Female                            |
      | Date of birth | 31 October 1980                   |
      | Address       | 22 Waldorf Court Cardiff AD21 5DR |
      | Nationality   | Unknown                           |

  Scenario: View the person section of the case summary for a defendant with an existing probation record by clicking the defendant link from the case list page
    Given I am a registered user
    When I navigate to the "cases" route
    Then I should be on the "Cases" page
    And I should see the heading "Cases"
    And I should see the caption "Sheffield Magistrates' Court"
    When I click the "Webb Mitchell" link
    Then I should be on the "Case details" page
    And I should see the heading "Webb Mitchell"
    When I click the sub navigation with "Personal details" text
    Then I should see the following level 2 headings
      | Personal details from charge | Personal details from Probation Service |
    And I should see the "first" summary table
      | Name          | Webb Mitchell                       |
      | Gender        | Male                                |
      | Date of birth | 13 October 1958                     |
      | Address       | 49 Rochester Avenue Bangor AD21 5DR |
      | Nationality   | Polish                              |
    And I should see the "second" summary table
      | Aliases              | Yes (1)                                                        |
      | NI Number            | JB 86 84 81 D                                                  |
      | Ethnicity            | Black British                                                  |
      | Interpreter required | No                                                             |
      | Disability status    | Speech Impairment                                              |
      | Telephone            | 01941 580 367                                                  |
      | Email                | lizzie.lambert@anarco.net                                      |
      | Mobile               | 07886 541 286                                                  |
      | Address              | Isoplex Towers 36 Abbey Court Sheffield South Yorkshire S1 1JD |

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
