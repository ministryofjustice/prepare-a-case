Feature: Select court
  In order to view the list of cases sitting on the day in my court
  As an authenticated user
  I want to be able to select my chosen court from a list of available courts

  Scenario: View the page with a list of available courts
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Which courts do you work in?"
    And I should see the body text "Add and save the courts you work in to view case lists for those courts."
    And There should be no a11y violations

  Scenario: Click the Add button without selecting a court
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Which courts do you work in?"
    And I click the "Add" button
    Then I should see the error message "You must add a court"
    And There should be no a11y violations

  Scenario: Click the Save and continue button without selecting a court
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Which courts do you work in?"
    And I click the "Save and continue" button
    Then I should see the error message "You must add a court"
    And There should be no a11y violations

  Scenario: Select a court from the list of available courts using the autocomplete component
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Which courts do you work in?"
    When I enter the text "Sheff" into the "pac-select-court" input and press ENTER
    And I click the "Add" button
    Then I should see the text "Sheffield Magistrates' Court" in a table cell
    And I should see link "Remove" with href "?remove=B14LO"
    When I click the "Save and continue" button
    Then I should be on the "My courts" page
    Then I should see link "Edit my courts" with href "/my-courts/edit"
    And I should see link "Sheffield Magistrates' Court" with href "/select-court/B14LO"
    And There should be no a11y violations

  Scenario: Edit my selected courts
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Which courts do you work in?"
    When I enter the text "Sheff" into the "pac-select-court" input and press ENTER
    And I click the "Add" button
    When I click the "Save and continue" button
    Then I should be on the "My courts" page
    Then I should see link "Edit my courts" with href "/my-courts/edit"
    And I should see link "Sheffield Magistrates' Court" with href "/select-court/B14LO"
    When I click the "Edit my courts" link
    Then I should be on the "Edit my courts" page
    And I should see the body text "Add or remove courts from your list."
    Then I should see the text "Sheffield Magistrates' Court" in a table cell
    And I should see link "Remove" with href "?remove=B14LO"
    And I should see link "Cancel" with href "/my-courts"
    When I click the "Remove" link
    Then I should not see the "Remove" link
    When I enter the text "Sheff" into the "pac-select-court" input and press ENTER
    And I click the "Add" button
    And I click the "Save list and continue" button
    Then I should be on the "My courts" page
    And There should be no a11y violations

  Scenario: View my court selection
    Given I am an authenticated user
    When I open the application
    Then I should see the heading "Which courts do you work in?"
    When I enter the text "Sheff" into the "pac-select-court" input and press ENTER
    And I click the "Add" button
    When I click the "Save and continue" button
    Then I should be on the "My courts" page
    Then I click the "Edit my courts" link
    Then I should be on the "Edit my courts" page
    When I click the "My courts" header navigation link
    Then I should be on the "My courts" page
    When I click the "Sheffield Magistrates' Court" link
    Then I should be on the "Case list" page
    And I should see the caption with the court name "Sheffield Magistrates' Court"
    And There should be no a11y violations
