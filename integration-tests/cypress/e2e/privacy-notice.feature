Feature: Privacy notice
  In order to understand how privacy and personal data are managed in the service
  As an authenticated user
  I want to be able to access the privacy notice within the service

  Scenario: View the privacy notice
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Privacy" with href "/privacy-notice"
    And I navigate to the "/privacy-notice" base route

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/PLY6UR/"
    And I should see phase banner link "report a bug" with href "https://mojprod.service-now.com/moj_sp?id=sc_cat_item&sys_id=2659ea2b1b600a1425dc6351f54bcb7b"

    Then I should see the heading "Privacy notice"
    And There should be no a11y violations
