Feature: Set Notification
  In order to display a notification to users
  As an authenticated user
  I want to be able to set a notification within the application

  Scenario: View the set notification page
    Given I am an authenticated user
    When I navigate to the "/set-notification" protected route
    Then I should be on the "Set notification" page

    And I should see the "Important" preview title
    And I should see the "" in the preview html
    And the preview html should have a height of "68px"
    And I should "NOT SEE" an error message

    And There should be no a11y violations

    When I type the text "test" into the input field
    Then I should see the "test" in the preview html
    And the preview html should have a height of "89px"
    And the submit button should be "enabled"

    And There should be no a11y violations

    When I type the text "<a href='/test'>Link" into the input field
    Then I should "SEE" an error message
    And I should see the 'test<a href="/test">Link</a>' in the preview html
    And the submit button should be "disabled"

    And There should be no a11y violations

    When I type the text "</a>" into the input field
    Then I should "NOT SEE" an error message
    And I should see the 'test<a href="/test">Link</a>' in the preview html
    And the submit button should be "enabled"

    And There should be no a11y violations
