Feature: Case list Prep
  In order to view the list of cases sitting on the day in court
  As an authenticated user
  I want to see and set prep status

  Background:
    Given I am an authenticated user
    When I navigate to the "cases" route for today
    Then I should be on the "Case list" page
    When I clear the filters

  # AC001 - NOT TESTED, THE BACKEND SETS THE DEFAULT STATE
  # Scenario: default state
  #  Given I am an authenticated user
  #  When I navigate to the "cases" route for today
  #  Then I should be on the "Case list" page
  #  And prep status of new items defaults to ‘Not started’

  # AC002
  Scenario: correct options show
    Then any prep status drop down should have items
      | Not started |
      | Ongoing     |
      | Complete    |

  # AC003
  Scenario: setting prep status works
    When I set the prep status for select 1 to "Complete" the change invokes a 200

  # AC004
  Scenario: setting prep status fails
    When I set the prep status for select 2 to "Ongoing" the change invokes a 404
    Then I see a window.alert with message "Error: Unable to change the admin prep status for Mann Carroll. Try again"
    And select 2 has a state of "Complete"

# AC005 - tested as part of AC003
# Scenario: network send occurs
#  Given I am an authenticated user
#  When I navigate to the "cases" route for today
#  Then I should be on the "Case list" page
#  When I can set the prep status for select "2" to any option