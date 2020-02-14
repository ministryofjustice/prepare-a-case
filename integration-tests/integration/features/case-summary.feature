Feature: Case summry
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
      | Case details | Person |
    And I should see the heading "Kara Ayers"
    And I should see the body text "Date of birth: 31-10-1980"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the body text "Court room 10 on Thursday 13 Feb, morning session."
    And I should see the body text "Assault by beating" in bold
    And I should see the body text "On 01/01/2016 at Newcastle assaulted Short Pearson by beating him."
    And I should see the caption text "Contrary to section 39 of the Criminal Justice Act 1988."
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with an existing probation record
    Given I am a registered user
    When I navigate to the "case/6627839278/details" route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Person | Probation record | Risk registers |
    And I should see the heading "Webb Mitchell"
    And I should see the body text "Date of birth: 13-10-1958"
    And I should see the body text "CRN: DX12340A"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the body text "Court room 8 on Thursday 13 Feb, morning session."
    And I should see the body text "Theft from the person of another" in bold
    And I should see the body text "On 24/03/2016 at Edinburgh stole PLAYSTATION 4 to the value of 300.00, belonging to Dillard Everett."
    And I should see the caption text "Contrary to section 1(1) and 7 of the Theft Act 1968."
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with a current probation record and risk of serious harm
    Given I am a registered user
    When I navigate to the "case/668911253/details" route
    Then I should be on the "Case details" page
    And I should see sub navigation with the following links
      | Case details | Person | Probation record | Risk registers |
    And I should see the heading "Lenore Marquez"
    And I should see the body text "Date of birth: 18-08-1979"
    And I should see the body text "CRN: DX12340A"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the following alerts
      | Medium Risk of Serious Harm | Current offender |
    And I should see the following level 2 headings
      | Appearance | Offences |
    And I should see the following level 3 headings
      | CPS pack |
    And I should see link "View CPS Pack (opens in Court Store)" with href "#"
    And I should see the body text "Court room 6 on Thursday 13 Feb, morning session."
    And I should see the body text "Attempt theft from the person of another" in bold
    And I should see the body text "On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron."
    And I should see the caption text "Contrary to section 1(1) of the Criminal Attempts Act 1981."
    And There should be no a11y violations
