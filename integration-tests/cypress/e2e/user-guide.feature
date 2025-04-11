Feature: User guide
  In order to understand how to use the Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a user guide within the service

  Scenario: View the user guide page
    Given I am an authenticated user
    When I open the application
    And I navigate to the "/user-guide" base route
    Then I should see the heading "User guide"

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/NMOI4O/"
    And I should see phase banner link "report a bug" with href "https://mojprod.service-now.com/moj_sp?id=sc_cat_item&sys_id=2659ea2b1b600a1425dc6351f54bcb7b"

    And I should see the text "Overview" in a list
    And I should see link "Overview" with href "#ug-overview"
    And I should see footer link "User guide" with href "/user-guide"
    And I should see an iframe with src "https://www.youtube.com/embed/3WiMGksB9iE"
    And There should be no a11y violations
