Feature: Outcomes List
  In order to view the list of outcomes
  As an authenticated user
  I want to click on the Outcomes link in the Primary navigation
  So that I can go to the Outcomes page.

  Scenario: Clicking on the Outcomes link should take me to the Outcomes page
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    And I should see the Primary navigation
    And I should see the Primary navigation "Outcomes" link
    When I click on the "Outcomes" link in the Primary navigation
    Then I should be on the "Hearing outcomes" page
    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/PLY6UR/"
    And I should see phase banner link "report a bug" with href "https://mojprod.service-now.com/moj_sp?id=sc_cat_item&sys_id=2659ea2b1b600a1425dc6351f54bcb7b"
    And I should see a tab with text "Cases to result"
    And I should see a tab with text "In progress"
    And I should see a tab with text "Resulted cases"

  Scenario: View the In progress tab on the Outcomes page
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I click the "In progress" link
    Then I should see the URL with "in-progress"

  Scenario: View the Resulted Cases tab on the Outcomes page
    Given I am an authenticated user
    When I navigate to the "outcomes" route
    Then I should be on the "Hearing outcomes" page
    When I click the "Resulted cases" link
    Then I should see the URL with "resulted-cases"

  Scenario: Should be able to see and navigate to hearing outcomes from case summary page
    Given I am an authenticated user
    When I navigate to the "cases" route
    Then I should be on the "Case list" page
    When I clear the filters
    When I click the "English Madden" link
    And I should see the Primary navigation "Outcomes" link
    When I click on the "Outcomes" link in the Primary navigation
    Then I should be on the "Hearing outcomes" page