Feature: Accessibility statement
  In order to understand how to use the accessibility features of Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a accessibility statement within the service

  Scenario: View the accessibility statement page
    Given I am an authenticated user
    When I open the application
    Then I should see footer link "Accessibility statement" with href "/accessibility-statement"

    When I navigate to the "/accessibility-statement" base route
    Then I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/PLY6UR/"
    And I should see phase banner link "report a bug" with href "https://mojprod.service-now.com/moj_sp?id=sc_cat_item&sys_id=2659ea2b1b600a1425dc6351f54bcb7b"
    
    And I should see the heading "Accessibility statement"
    And There should be no a11y violations