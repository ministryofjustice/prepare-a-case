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
    And the page should produce a 404 error