Feature: Case summary
  In order to view the of summary of a case sitting on the day in court
  As an authenticated user
  I want to see a case summary view

  Scenario: View the case summary with no contact detail for a Libra case by clicking the link on the case list page
    Given I am an authenticated user
    When I navigate to the "cases" route
    Then I should be on the "Case list" page
    When I clear the filters

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"
    And I should see phase banner link "report a bug" with href "https://docs.google.com/forms/d/e/1FAIpQLSfLqoIFzPIivFNJwCvQPcw6L_fUkbTY6RNqgzrIpN4XGKBqpA/viewform?pli=1"

    And I should see the caption with the court name "Sheffield Magistrates' Court"
    When I click the "Kara Ayers" link
    Then I should be on the "Case summary" page
    And I should see the level 2 heading "Kara Ayers"
    And I should see back link "Back to cases" with href "/B14LO/cases?page=1"
    And I should see the caption text "Source: Libra"
    And I should see the caption text "Case number: 8678951874"
    And I should see the caption text "URN: 01WW0298121"

    Then I should see the following summary list
      | Name          | Kara Ayers                        |
      | Gender        | Female                            |
      | Date of birth | 31 October 1980                   |
      | Address       | 22 Waldorf Court Cardiff AD21 5DR |

    And There should be no a11y violations

  Scenario: View the case summary with contact details for a Common Platform case by clicking the link on the case list page
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/a395526d-b805-4c52-8f61-3c41bca15537/defendant/d1d38809-af04-4ff0-9328-4db39c0a3d85/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see the caption text "Source: Common Platform"
    And I should see the caption text "URN: 01WW0298121"
    And I should see sub navigation with the following links
      | Case summary | Probation record | Risk register |
    And I should see the following level 2 headings
      | Mann Carroll | Defendant details | Case documents | Appearance | Offences |

    And I should see the body text "Court 2-3, afternoon session, $LONG_TODAY."
    Then I should see the following list of charges in an accordion component
      | Assault by beating |
      | Theft from a shop  |
      | Theft from a shop  |
      | Assault by beating |

    And I should see the following summary list
      | Name          | Mann Carroll                                                          |
      | Gender        | Female                                                                |
      | Date of birth | Unknown                                                               |
      | Phone number  | 020 456 456 456 (Home) 07 123 123 123 (Mobile) 020 789 789 789 (Work) |
      | Address       | 91 Barbey street Sheffield AD21 5DR                                   |

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant that has not been matched with an existing NDelius record
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/fdcfd5fa-95f4-45eb-a6d4-aa2fa2e4676e/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see the body text "Probation status: Possible NDelius record"
    And I should see the following level 2 headings
      | Guadalupe Hess | possible NDelius records found | Defendant details | Case documents | Appearance | Offences |

    And I should see the body text "Court 7, morning session, $LONG_TODAY."
    Then I should see the following list of charges in an accordion component
      | Assault by beating                       |
      | Attempt theft from the person of another |

    And I should see the following summary list
      | Name          | Guadalupe Hess                         |
      | Gender        | Male                                   |
      | Date of birth | 18 February 1989                       |
      | Address       | 43 Hunterfly Place Birmingham AD21 5DR |

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with no probation record
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    Then I should see the body text "Probation status: No record"
    And I should not see the case level navigation
    And I should see the following level 2 headings
      | Kara Ayers | Defendant details | Case documents | Appearance | Offences |

    And I should see the body text "Court Crown Court 3-1, morning session, $LONG_TODAY."
    Then I should see the following list of charges in an accordion component
      | Attempt theft from the person of another |
      | Assault by beating                       |
      | Attempt theft from the person of another |
      | Assault by beating                       |

    And I should see the following summary list
      | Name          | Kara Ayers                        |
      | Gender        | Female                            |
      | Date of birth | 31 October 1980                   |
      | Address       | 22 Waldorf Court Cardiff AD21 5DR |

    And I should see a button with the label "Actions"
    And I click the "Actions" button
    And I should see an MOJ menu button with the label "Link NDelius Record"
    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with an existing probation record
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/37a5b7f9-e1e5-453b-a3cf-7246971ec71c/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see sub navigation with the following links
      | Case summary | Probation record | Risk register |
    Then I should see the body text "CRN: D541487"
    Then I should see the body text "PNC: A/8404713BA"
    Then I should see the body text "Probation status: Previously known"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Webb Mitchell | Defendant details | Case documents | Appearance | Offences |

    And I should see the body text "Court 8, morning session, $LONG_TODAY."
    Then I should see the following list of charges in an accordion component
      | Attempt theft from the person of another |
      | Assault by beating                       |
      | Attempt theft from the person of another |

    And I should see the following summary list
      | Name          | Webb Mitchell                       |
      | Gender        | Not specified                       |
      | Date of birth | 13 October 1958                     |
      | Phone number  | 020 789 789 789 (Work)              |
      | Address       | 49 Rochester Avenue Bangor AD21 5DR |

    And I should see a button with the label "Actions"
    And I click the "Actions" button
    And I should see an MOJ menu button with the label "Unlink NDelius Record"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with a pre-sentence record
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/a395526d-b805-4c52-8f61-3c41bca15537/defendant/d1d38809-af04-4ff0-9328-4db39c0a3d85/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    Then I should see the body text "CRN: V654123"
    Then I should see the body text "PNC: A/1234560BA"
    Then I should see the body text "Probation status: Pre-sentence record (PSR)"
    And I should see the caption text "Source: Common Platform"
    And I should see the caption text "URN: 01WW0298121"
    And I should see sub navigation with the following links
      | Case summary | Probation record | Risk register |
    And I should see the following level 2 headings
      | Mann Carroll | Defendant details | Case documents | Appearance | Offences |

    And I should see the body text "Court 2-3, afternoon session, $LONG_TODAY."
    Then I should see the following list of charges in an accordion component
      | Assault by beating |
      | Theft from a shop  |
      | Theft from a shop  |
      | Assault by beating |

    And I should see the following summary list
      | Name          | Mann Carroll                        |
      | Gender        | Female                              |
      | Date of birth | Unknown                             |
      | Phone number  | 07 123 123 123 (Mobile)             |
      | Address       | 91 Barbey street Sheffield AD21 5DR |

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant with a current probation record
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the body text "CRN: DX12340A"
    And I should see the body text "PNC: A/1234560BA"
    And I should see the body text "Probation status: Current (PSR)"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Lenore Marquez | Defendant details | Case documents | Appearance | Offences |

    And I should see the body text "Court 6, morning session, $LONG_TODAY."
    Then I should see the following list of charges in an accordion component
      | Attempt theft from the person of another |
      | Theft from the person of another         |
      | Attempt theft from the person of another |
      | Attempt theft from the person of another |

    And I should see the following summary list
      | Name          | Lenore Marquez                     |
      | Gender        | Female                             |
      | Date of birth | 18 August 1979                     |
      | Phone number  | Unavailable                        |
      | Address       | 38 Clarendon Road Glasgow AD21 5DR |

    And I should see a button with the label "Actions"
    And I click the "Actions" button
    And I should see an MOJ menu button with the label "Unlink NDelius Record"

    And There should be no a11y violations

  Scenario: View the case summary for the given defendant in breach of a current order
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/8d187ea4-d24d-4806-a5c7-1626919c44bb/defendant/9f60bdb8-0978-404c-bd89-addc3f5388a7/summary" base route
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases/$TODAY"
    And I should see sub navigation with the following links
      | Case summary | Probation record |
    And I should see the body text "CRN: D991494"
    And I should see the body text "PNC: D/9874483AB"
    And I should see the body text "Probation status: Current (Breach)"
    And I should see a straight line divide
    And I should see the following level 2 headings
      | Olsen Alexander | Defendant details | Case documents | Appearance | Offences |

    And I should see the body text "Court 9, morning session, $LONG_TODAY."
    And I should see the body text "Theft from a shop" in bold
    And I should see the body text "On 01/01/2015 at Tetratrex, Leeds, stole ROBOTS to the value of £987.00, belonging to Young Bryant."
    And I should see the caption text "Contrary to section 1(1) and 7 of the Theft Act 1968."

    And I should see the following summary list
      | Name          | Olsen Alexander                 |
      | Gender        | Male                            |
      | Date of birth | 6 June 1996                     |
      | Address       | 99 Ralph Avenue London AD21 5DR |

    And I should see a button with the label "Actions"
    And I click the "Actions" button
    And I should see an MOJ menu button with the label "Unlink NDelius Record"

    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a previously known offender
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "cases" route
    Then I should be on the "Case list" page
    When I clear the filters
    And I should see the caption with the court name "Sheffield Magistrates' Court"
    When I click the "Webb Mitchell" link
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases?page=1"
    When I click the sub navigation with "Probation record" text
    Then I should see the level 2 heading "Pre-sentence report requested (2)"
    Then I should see the level 2 heading "Current orders (1)"
    Then I should see the level 2 heading "Previous orders (4)"
    And I should see the body text "Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801"
    And I should see the hint text "Offence committed on 10 November 2017"
    And I should see the body text "Report requested on 5 July 2021"
    And I should see the following summary list
      | Type        | Pre-Sentence Report - Fast |
      | Author      | Carrie Smith               |
      | Required by | 9 July 2021                |
      | Status      | Complete (8 July 2021)     |
    And I should see the body text "Noise offences - 82200"
    And I should see the hint text "Offence committed on 6 January 2021"
    And I should see the following level 2 headings
      | Webb Mitchell | Pre-sentence report requested | Current orders | Previous orders | Last OASys assessment |
    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a current offender
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "cases" route
    Then I should be on the "Case list" page
    When I clear the filters
    When I click the "Lenore Marquez" link
    And I click the sub navigation with "Probation record" text
    Then I should see the level 2 heading "Current orders (3)"
    And I should see link "ORA Community Order (18 Months)" with href "record/1403337513"
    And I should see the text "Curfew Arrangement" within element with class "qa-current-licence-conditions-1"
    And I should see the text "Curfew Arrangement" within element with class "qa-current-pss-requirements-2"
    And I should see the body text "Stealing mail bags or postal packets or unlawfully taking away or opening mail bag - 04200"
    And I should see the hint text "Started on 20 May 2019"

    And I should see the level 2 heading "Previous orders (11)"
    And I should see link "CJA - Std Determinate Custody" with href "record/636401162"
    And I should see the text "Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801" within element with class "qa-previous-order-1-offence"
    And I should see the text "Ended on 23 Jan 2018" within element with class "qa-previous-order-1-end-date"

    And I should see the following level 2 headings
      | Lenore Marquez | Pre-sentence report requested | Current orders | Previous orders | Offender manager | Last pre-sentence report | Last OASys assessment |
    And I should see the body text "Angel Extravaganza"
    And I should see the hint text "Allocated on 12 Aug 2017"
    And I should see the body text "Email: d@none.com"
    And I should see the body text "Provider: NPS Midlands"
    And I should see the body text "LDU: N04 Division"
    And I should see the body text "Team: OMU A"
    And I should see the body text "Team phone: 0114 22278787"

    And I should see medium heading with text "Last pre-sentence report"
    And I should see the body text "Pre-Sentence Report - Fast"
    And I should see the hint text "Completed more than 6 months ago"

    And I should see medium heading with text "Last OASys assessment"
    And I should see the body text "OASys Assessment Layer 3"
    And I should see the hint text "Completed on 20 Jun 2018"

    And I should see the following level 3 headings
      | Requirements | Status | Licence conditions | Status | Licence conditions | Status | PSS requirements |

    And I should see 5 previous orders
    When I click the "Show all previous orders" button
    Then I should see 11 previous orders
    And There should be no a11y violations

  Scenario: View the probation record section of the case summary for a current offender who is currently in custody
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "cases" route
    Then I should be on the "Case list" page
    When I clear the filters
    When I click the "English Madden" link
    And I click the sub navigation with "Probation record" text
    Then I should see the level 2 heading "Current orders (1)"
    And I should see link "CJA - Std Determinate Custody (18 Months)" with href "record/345464567"
    And I should see the body text "Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801"
    And I should see the hint text "Started on 8 Mar 2017"
    And I should see the text "Status" within element with class "govuk-heading-s"
    And I should see the body text "In custody"

    And There should be no a11y violations

  Scenario: View the probation record section of the case summary when the user has restricted access marker
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Case list" page
    When I clear the filters
    And I should see the caption with the court name "Sheffield Magistrates' Court"
    When I click the "Latoya Kirkland" link
    Then I should be on the "Case summary" page
    And I should see back link "Back to cases" with href "/B14LO/cases?page=1"
    And I should see the level 2 heading "Latoya Kirkland"
    When I click the sub navigation with "Probation record" text
    Then I should see the heading "You are restricted from viewing this record"

    And I should see the body text "You cannot view probation information for this defendant due to restrictions on your NDelius account."
    And I should see the body text "If you think you should be able to view this case, contact your line manager."

    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order with unpaid work appointments
    Given I am an authenticated user

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record" base route
    Then I should be on the "Probation record" page
    And I should see the level 2 heading "Lenore Marquez"

    When I click the "ORA Community Order (18 Months)" link
    Then I should be on the "ORA Community Order (18 Months)" page
    And I should see the heading "ORA Community Order (18 Months)"
    And I should see the level 2 heading "Attendance"

    And I should see the following level 3 headings
      | Last attended: | Appointments to date | Acceptable | Unacceptable |
    And I should see the body text "4 Mar 2020 - Planned office visit (Acceptable)"

    And I should see the text "Order started" within element with class "qa-start-title"
    And I should see the text "Order ends" within element with class "qa-end-title"
    And I should see the text "Time elapsed" within element with class "qa-elapsed-title"

    And I should see the text "20 May 2019" within element with class "qa-start-date"
    And I should see the text "25 May 2020" within element with class "qa-end-date"

    And I should see the correctly calculated elapsed time between "2019-05-20" and "2020-05-25"

    And I should see the following level 3 headings
      | Last attended: | Appointments to date | Acceptable | Unacceptable | Awaiting outcome |
    And I should see the following attendance counts
      | 10 | 6 | 2 | 2 | 1 | 1 | 0 | 1 | 1 | 2 | 2 | 1 |
    And I should see the body text "Planned office visit"
    And I should see the body text "Unpaid work"
    And I should see the body text "Appointment with External Agency"
    And I should see the body text "IAPS / Accredited programme"

    And I should see the text "Terminated - 23 Jan 2018" within element with class "qa-upw-status"
    And I should see the text "12" within element with class "qa-upw-ordered"
    And I should see the text "2" within element with class "qa-upw-worked"
    And I should see the text "2" within element with class "qa-upw-appointments"
    And I should see the text "2" within element with class "qa-upw-attended"
    And I should see the text "0" within element with class "qa-upw-acceptable"

    And There should be no a11y violations

  Scenario: View the current offender order who is currently on licence
    Given I am an authenticated user

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/1309234876" base route
    Then I should be on the "ORA Adult Custody (inc PSS) (12 Months)" page

    And I should see the text "Post-release status" within element with class "qa-start-title"
    And I should see the text "Licence started" within element with class "qa-end-title"
    And I should see the text "Licence ends" within element with class "qa-elapsed-title"
    And I should see the text "On licence" within element with class "qa-start-date"
    And I should see the text "$SIX_MONTHS_AGO" within element with class "qa-end-date"
    And I should see the text "$SIX_MONTHS_TIME" within element with class "qa-elapsed-time"

    And I should see the level 2 heading "Post-release dates"
    And I should see the following table rows
      | Licence | $SIX_MONTHS_AGO | $SIX_MONTHS_TIME |

    And I should see the level 2 heading "Contact list"
    And I should see link "View contact list (opens in NDelius)" with href "https://ndelius-dummy-url/deeplink.jsp?component=ContactList&offenderId=1309234876&eventId=123123128"

    And There should be no a11y violations

  Scenario: View the current offender order who is currently in custody
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/9b9a6ab6-ef6d-485a-a8b4-b79b67e5b1f8/defendant/82bfc40d-389a-46ba-81e1-0829a5fbf6c8/record/345464567" base route
    Then I should be on the "CJA - Std Determinate Custody (18 Months)" page

    And I should see the text "Status" within element with class "qa-elapsed-title"
    And I should see the text "In custody" within element with class "qa-elapsed-time"

    And I should see the level 2 heading "Post-release dates"
    And I should see the level 2 heading "Requirements"
    And I should see the level 2 heading "Attendance"

    And I should see the following table rows
      | Home detention curfew     | $ONE_MONTHS_TIME   | $THREE_MONTHS_TIME |
      | Post sentence supervision | $THREE_MONTHS_TIME | $SIX_MONTHS_TIME   |

    And There should be no a11y violations

  Scenario: View the licence conditions details for a current offender
    Given I am an authenticated user

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/1309234876" base route
    Then I should be on the "ORA Adult Custody (inc PSS) (12 Months)" page

    And I should see link "View licence conditions details" with href "/record/1309234876/licence-details"
    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/1309234876/licence-details" base route
    Then I should be on the "Licence conditions details" page
    And I should see the text "Alcohol" within element with class "govuk-heading-m"
    And I should see the following summary list 3 with keys
      | Condition | Start date | Notes |

    And I should see the text "Confine yourself to remain at [CURFEW ADDRESS] initially from [START OF CURFEW HOURS] until [END OF CURFEW HOURS] each day, and, thereafter, for such a period as may be reasonably notified to you by your supervising officer; & comply with such arrangements as may be reasonably put in place & notified to you by your supervising officer so as to allow for your whereabouts & your compliance with your curfew reqt.be monitored[WHETHER BY ELECT. MEANS INVOLVING YOUR WEARING AN ELECT. TAG OR OTHERWISE]" within element with class "govuk-summary-list__value"
    And I should see the text "6 January 2018" within element with class "govuk-summary-list__value"
    And I should see the text "This is an example of licence condition notes" within element with class "govuk-summary-list__value"

    And There should be no a11y violations

  Scenario: View the current offender order who is currently on Post Sentence Supervision
    Given I am an authenticated user

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/2360414697" base route
    Then I should be on the "ORA Adult Custody (inc PSS) (18 Months)" page

    And I should see the text "Post-release status" within element with class "qa-start-title"
    And I should see the text "PSS started" within element with class "qa-end-title"
    And I should see the text "PSS ends" within element with class "qa-elapsed-title"
    And I should see the text "On post-sentence supervision (PSS)" within element with class "qa-start-date"
    And I should see the text "$END_TOMORROW" within element with class "qa-end-date"
    And I should see the text "$FIVE_MONTHS_TIME" within element with class "qa-elapsed-time"

    And I should see the following table rows
      | Licence                   | $ONE_YEAR_AGO | $END_TODAY        |
      | Post sentence supervision | $END_TOMORROW | $FIVE_MONTHS_TIME |

    And I should see the level 2 heading "Contact list"
    And I should see link "View contact list (opens in NDelius)" with href "https://ndelius-dummy-url/deeplink.jsp?component=ContactList&offenderId=2360414697&eventId=123123130"

    And There should be no a11y violations

  Scenario: View the attendance record section of the current offender order in breach without unpaid work appointments
    Given I am an authenticated user
    And I click the "Accept analytics cookies" button
    Then I should not see the cookie banner

    When I navigate to the "/B14LO/hearing/8d187ea4-d24d-4806-a5c7-1626919c44bb/defendant/9f60bdb8-0978-404c-bd89-addc3f5388a7/record" base route
    Then I should be on the "Probation record" page
    And I should see the level 2 heading "Olsen Alexander"

    And I should see medium heading with text "Last pre-sentence report"
    And I should see the body text "Pre-Sentence Report - Fast"
    And I should see the hint text "Completed less than 1 month ago"

    And I should see link "ORA Community Order (18 Months)" with href "record/1361422142"
    And I should see the breach badge
    When I click the "ORA Community Order (18 Months)" link
    Then I should be on the "ORA Community Order (18 Months)" page
    And I should see the heading "ORA Community Order (18 Months)"

    And I should see the body text "Abstracting electricity - 04300"
    And I should see the following level 3 headings
      | Last attended: | Appointments to date | Acceptable | Unacceptable |
    And I should see the body text "10 Mar 2020 - Unpaid work (Acceptable)"

    And I should see the text "Order started" within element with class "qa-start-title"
    And I should see the text "Order ends" within element with class "qa-end-title"
    And I should see the text "Time elapsed" within element with class "qa-elapsed-title"

    And I should see the text "7 Oct 2018" within element with class "qa-start-date"
    And I should see the text "17 Jun 2020" within element with class "qa-end-date"

    And I should see the correctly calculated elapsed time between "2018-10-07" and "2020-06-17"

    And I should see the level 2 heading "Breaches"
    And I should see the following table headings
      | Breach | Status | Status date |
    And I should see the following table rows
      | Community Order/SSO Breach | In progress                     | 30 Dec 2014 |
      | Community Order/SSO Breach | Breach Summons Issued           | 26 Dec 2014 |
      | Community Order/SSO Breach | Completed - Amended & Continued | 26 Nov 2013 |

    And I should see link "Community Order/SSO Breach" in position 3 with href "1361422142/breach/12345"
    And I should see link "Community Order/SSO Breach" in position 4 with href "1361422142/breach/54321"
    And I should see link "Community Order/SSO Breach" in position 5 with href "1361422142/breach/98765"

    And I should see the level 2 heading "Attendance"

    And I should see the following level 3 headings
      | Last attended: | Appointments to date | Acceptable | Unacceptable | Awaiting outcome |
    And I should see the following attendance counts
      | 57 | 25 | 9 | 7 | 5 | 4 | 6 | 2 | 2 | 2 | 11 | 3 | 3 | 3 | 2 | 5 | 2 | 1 | 1 | 1 | 10 |
    And I should see the body text "Planned office visit"
    And I should see the body text "Unpaid work"
    And I should see the body text "Appointment with External Agency"
    And I should see the body text "IAPS / Accredited programme"

    And I should see the text "Terminated - 1 Apr 2020" within element with class "qa-upw-status"
    And I should see the text "32" within element with class "qa-upw-ordered"
    And I should see the text "30" within element with class "qa-upw-worked"

    When I click breach link 1
    Then I should be on the "Breach details" page
    And I should see the breach banner with text "This breach is not ready to prosecute"
    And I should see the level 2 heading "Community Order/SSO Breach"
    And I should see the level 3 heading "Notes"
    And I should see the body text "Paragraph 1: Some information. Paragraph 2: And some more."
    And I should see the level 3 heading "Attachments"
    And I should see the body text "No attachments have been added."

    And I should see the following summary list
      | Order           | ORA Community Order (12 Months)           |
      | Sentenced at    | Harrogate Magistrates' Court              |
      | Breach incident | 19 Feb 2020                               |
      | Provider        | NPS North East                            |
      | Team            | Enforcement hub - Sheffield and Rotherham |
      | Officer         | Unallocated                               |
      | Status          | Breach initiated                          |
      | Status date     | 22 May 2020                               |

    When I click the "Back" link
    And I click breach link 2
    Then I should be on the "Breach details" page
    And I should see the breach banner with text "This breach is ready to prosecute"
    And I should see the level 3 heading "Notes"
    And I should see the body text "No notes have been added."
    And I should see the level 3 heading "Attachments"

    And I should see the following table headings
      | File | Added by | Date added |

    And I should see the following table rows
      | NAT NPS Breach Report CO SSO_D991494.doc | Claire Smith | 14 Mar 2020 |

    And I should see link "NAT NPS Breach Report CO SSO_D991494.doc" with href "/attachments/D991494/documents/12346/NAT NPS Breach Report CO SSO_D991494.doc"

    When I click the "Back" link
    And I click breach link 3
    Then I should be on the "Breach details" page
    And I should not see the breach banner message

    And There should be no a11y violations

  Scenario: View the attendance record section of the previous offender order
    Given I am an authenticated user

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record" base route
    Then I should be on the "Probation record" page
    And I should see the level 2 heading "Lenore Marquez"

    When I click the "CJA - Std Determinate Custody" link
    Then I should be on the "CJA - Std Determinate Custody (18 Months)" page
    And I should see the heading "CJA - Std Determinate Custody"

    And I should see the body text "Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801"

    And I should see the text "Order started" within element with class "qa-start-title"
    And I should see the text "Order ended" within element with class "qa-end-title"
    And I should see the text "Reason" within element with class "qa-elapsed-title"

    And I should see the text "8 Mar 2017" within element with class "qa-start-date"
    And I should see the text "23 Jan 2018" within element with class "qa-end-date"

    And I should see the text "ICMS Miscellaneous Event" within element with class "qa-elapsed-time"
    And I should not see the heading level 2 with text "Appointment attendance"
    And I should not see the heading level 2 with text "Unpaid work"
    And There should be no a11y violations

  Scenario: View the case details of a defendant to see a list of current charges and the associated summary/description
    Given I am an authenticated user
    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/summary" base route
    Then I should see the level 2 heading "Offences"
    And If the total number of charges is greater than one
    Then I should see the following list of charges in an accordion component
      | Attempt theft from the person of another |
      | Theft from the person of another         |
      | Attempt theft from the person of another |
      | Attempt theft from the person of another |

    And I click the accordion 1 section button
    Then The accordion section 1 should expand
    And I should see the body text "On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron."
    And I should see the caption text "Contrary to section 1(1) of the Criminal Attempts Act 1981."

  Scenario: View the requirements section of a current order
    Given I am an authenticated user

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record" base route
    Then I should be on the "Probation record" page
    And I should see the level 2 heading "Lenore Marquez"

    When I click the "ORA Community Order (18 Months)" link
    Then I should be on the "ORA Community Order (18 Months)" page
    And I should see the heading "ORA Community Order (18 Months)"
    And I should see the level 2 heading "Requirements"
    And I should see the following table headings
      | Requirement | Length |

  Scenario: View the requirements section of a previous order
    Given I am an authenticated user

    When I navigate to the "/B14LO/hearing/4e10a261-2d0f-4b07-a684-e2b03ee54a4f/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record" base route
    Then I should be on the "Probation record" page
    And I should see the level 2 heading "Lenore Marquez"

    When I click the "CJA - Std Determinate Custody" link
    Then I should be on the "CJA - Std Determinate Custody (18 Months)" page
    And I should see the heading "CJA - Std Determinate Custody"
    And I should see the level 2 heading "Requirements"
    And I should see the following table headings
      | Requirement | Length | Ended | Reason |

  Scenario: View the risk register section of the case summary for a previously known offender with risks
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Case list" page

    When I click the "Webb Mitchell" link
    And I click the sub navigation with "Risk register" text
    Then I should see the following risk register tabs
      | Active (4) | Inactive (1) |

    Then I click the "Active (4)" risk tab
    And I should see the level 2 heading 'Active registrations'
    And I should see the following table headings
      | Type | Registered | Next review | Notes |
    Then I click the "Inactive (1)" risk tab
    And I should see the level 2 heading 'Inactive registrations'
    And I should see the following table headings
      | Type | Registered | Next review | Notes |

    And There should be no a11y violations

  Scenario: View the risk register section of the case summary for a current offender with no risks
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Case list" page

    When I click the "Olsen Alexander" link
    And I click the sub navigation with "Risk register" text
    Then I should see the following risk register tabs
      | Active (0) | Inactive (0) |

    Then I click the "Active (0)" risk tab
    And I should see the body text "There are no active registrations"
    Then I click the "Inactive (0)" risk tab
    And I should see the body text "There are no inactive registrations"

    And There should be no a11y violations

  Scenario: View the risk register section of the case summary when a user has restricted access
    Given I am an authenticated user

    When I navigate to the "cases" route
    Then I should be on the "Case list" page

    When I click the "English Madden" link
    And I click the sub navigation with "Risk register" text
    And I should see the heading "You are restricted from viewing this record"

    And I should see the body text "You cannot view probation information for this defendant due to restrictions on your NDelius account."
    And I should see the body text "If you think you should be able to view this case, contact your line manager."

    And There should be no a11y violations

  Scenario: Move a case to resulted
    Given I am an authenticated user

    When I navigate to the "outcomes/in-progress" route
    Then I should be on the "Hearing outcomes" page

    When I click the "Rock Stone" link
    And I click the "Open as read only" link

    And I should see a button with the label "Actions"
    And I click the "Actions" button
    And I should see an MOJ menu button with the label "Move to resulted"
    And I click the "Move to resulted" MOJ menu button
    Then I should be on the "Hearing outcomes" page
    And I should see govuk notification banner with header "Success" and message "You have moved Rock Stone's case to resulted cases."

  Scenario: Move a case to resulted is disabled when not in progress
    Given I am an authenticated user

    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page

    When I click the "Some User" link
    And I click the "View without assigning" link

    And I should see a button with the label "Actions"
    And I click the "Actions" button
    And I should not see an MOJ button with the label "Move to resulted"
