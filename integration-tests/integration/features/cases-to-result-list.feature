Feature: Cases to Result List
  In order to view the list of cases to result
  As an authenticated user
  I need to see a list of cases that need resulting
  So that I can select what I am going to work on
  
  Scenario: Clicking on the Outcomes link should take me to the Outcomes page
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page

    And I should see the Primary navigation
    And I should see the Primary navigation "Cases" link

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://docs.google.com/forms/d/e/1FAIpQLScluoDOXsJ_XBO3iOp283JE9mN3vTVNgEJcPNDHQQvU-dbHuA/viewform?usp=sf_link"
    
    And I should see a tab with text "Cases to result"

    And I should see the following table headings
      | Defendant | Outcome type | Probation status | Offence | Hearing date |

    And I should see the following table rows
      | Kara Ayers     | No record                 | Attempt theft from the person of another | 1st | Morning |
      | Mann Carroll   | {Psr} Pre-sentence record | Assault by beating                       | 3rd | Morning |
      | Guadalupe Hess | {Possible}                | Assault by beating                       |     | Morning |

    And I should see link "Kara Ayers" with href "/hearing/5b9c8c1d-e552-494e-bc90-d475740c64d8/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary"
    And I should see link "Mann Carroll" with href "/hearing/a395526d-b805-4c52-8f61-3c41bca15537/defendant/d1d38809-af04-4ff0-9328-4db39c0a3d85/summary"
    And I should see secondary text "V654123"

    And There should be no a11y violations

  Scenario: View specific listing data on the case list
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    And Defendant "Latoya Kirkland" should display the following "Listing" data
      | 2nd | 4th | 6th | 8th | 10th |
    And Defendant "Dora Clayton" should display the following "Listing" data
      | 1st |