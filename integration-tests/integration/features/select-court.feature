Feature: Select court
  In order to view the list of cases sitting on the day in my court
  As an authenticated user
  I want to be able to select my chosen court from a list of available courts

  Scenario: View the page with a list of available courts
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Select a magistrates' court"

    And I should see link "Barnsley" with href "/select-court/B14AV"
    And I should see link "Beverley" with href "/select-court/B16BG"
    And I should see link "Birmingham" with href "/select-court/B20BL"
    And I should see link "Cardiff" with href "/select-court/B62DC"
    And I should see link "Doncaster" with href "/select-court/B14ET"
    And I should see link "Highbury Corner" with href "/select-court/B01GU"
    And I should see link "Hull" with href "/select-court/B16HE"
    And I should see link "Mid and South East Northumberland" with href "/select-court/B10BD"
    And I should see link "Newcastle" with href "/select-court/B10JJ"
    And I should see link "North Tyneside" with href "/select-court/B10JQ"
    And I should see link "Sheffield" with href "/select-court/B14LO"

    And There should be no a11y violations

  Scenario: Select a court from the list of available courts
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Select a magistrates' court"

    When I click the "Barnsley" link
    Then I should be on the "Cases" page
    And I should see the caption with the court name "Barnsley Magistrates' Court"

    And There should be no a11y violations
