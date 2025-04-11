Feature: Accessibility statement
  In order to understand how the cookies are used in Prepare a case for sentence service
  As an authenticated user
  I want to be able to access a cookies policy page within the service

  Scenario: View the cookies policy page
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Cookies" with href "/cookies-policy"
    And I navigate to the "/cookies-policy" base route

    And I should see the phase banner
    And I should see the tag "Feedback"
    And I should see phase banner link "Give us your feedback" with href "https://www.smartsurvey.co.uk/s/NMOI4O/"
    And I should see phase banner link "report a bug" with href "https://mojprod.service-now.com/moj_sp?id=sc_cat_item&sys_id=2659ea2b1b600a1425dc6351f54bcb7b"

    Then I should see the heading "Cookies"
    And I should see the following level 2 headings
      | Essential cookies | Analytics cookies (optional) | Change your cookie settings |
    And I should see the following table headings
      | Name | Purpose | Expires |
    And I should see the following table rows
      | Keeps you logged into the service                                                                                | 1 hour  |
      | Used to remember the court you last looked at                                                                    | 1 year  |
      | Saves your analytics cookie consent setting                                                                      | 1 year  |
    And There should be no a11y violations

  Scenario: View the success banner of the cookies policy page
    Given I am an authenticated user
    When I open the application
    And I should see footer link "Cookies" with href "/cookies-policy"
    And I navigate to the "/cookies-policy" base route
    Then I should see the heading "Cookies"
    And I should see the following level 2 headings
      | Essential cookies | Analytics cookies (optional) | Change your cookie settings |
    When I click the "Save cookie settings" button
    And I should see the success banner message "You’ve set your cookie preferences."
    And There should be no a11y violations
