Feature: Accessibility statement
  In order to understand how the cookies are used in Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a cookies policy page within the service

  Scenario: View the cookies policy page
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Cookies policy" with href "/cookies-policy"
    And I navigate to the "/cookies-policy" base route
    Then I should see the heading "Cookies"
    And I should see the following level 2 headings
    | Essential cookies | Analytics cookies (optional) | Change your cookie settings |
    And I should see the following table headings
      | Name | Purpose | Expires |
    And I should see the following table rows
      | Used to remember the court you last looked at | Does not expire |
      | Keeps you logged into the service | 2 hours |
      | [Saves your cookie consent settings] | [1 year] |
      | Checks if you’ve visited Prepare a case for sentence before. This helps us count how many people use the service | 2 years |
    And There should be no a11y violations

  Scenario: View the success banner of the cookies policy page
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Cookies policy" with href "/cookies-policy"
    And I navigate to the "/cookies-policy" base route
    Then I should see the heading "Cookies"
    And I should see the following level 2 headings
      | Essential cookies | Analytics cookies (optional) | Change your cookie settings |
    When I click the "Save cookie settings" button
    And I should see the success banner message "You’ve set your cookie preferences."
    And There should be no a11y violations