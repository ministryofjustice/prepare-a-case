Feature: Display correct error pages
  As an authenticated user,
  I need to know when a page does not exist,
  So I can check to see if I input the address incorrectly

  Scenario: when a user enters an address or clicks a broken link within the service, they are told the page does not exist
    Given I am an authenticated user
    When I navigate to the "abcdef" route
    And I should see the heading "Page not found"
    And I should see the body text "If you entered a web address, check it is correct."
    And I should see the body text "You can go to the home page to find the information you need."
    And I should see the body text "Not Found"
    And I should see the body text "Error: Not Found"
