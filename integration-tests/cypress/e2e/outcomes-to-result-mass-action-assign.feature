Feature: Case mass action (assign to)
  As an authenticated user
  I want to mass action several outcomes to assign them to me

#AC001
Scenario: can check a checkbox
  Given I am an authenticated user
  When I navigate to the "outcomes" route
  And I check a checkbox for a case record
  Then the checkbox is checked

#AC002
Scenario: can quick check all checkboxes
  Given I am an authenticated user
  When I navigate to the "outcomes" route
  And I check the mass-action checkbox
  Then checkboxes for all cases are checked

#AC003
Scenario: action button becomes enabled
  Given I am an authenticated user
  When I navigate to the "outcomes" route
  And I check a checkbox for a case record
  Then the option 'Assign to Me' in the Action menu is enabled

#AC004
Scenario: action button defaults to disabled
  Given I am an authenticated user
  When I navigate to the "outcomes" route
  Then the option 'Assign to Me' in the Action menu is disabled

#AC005
Scenario: success banner shows correctly
  Given I am an authenticated user
  When I navigate to the "outcomes" route
  And I check a checkbox for a case record
  And I click to assign the case
  Then I see a success banner stating "You are assigned to result 1 case. They have moved to the in-progress tab."

#AC006 - NOT IMPLEMENTED - The logic is handled by the page reload and so tested elsewhere.
#Scenario: outcomes tally updates
  #Given I am on the Outcomes work flow page(viewing cases to result tab)     
  #When I assigned more than one record to me
  #And the records are successfully assigned
  #Then I can see the count in the ‘In progress’ tab automatically increases 
  #And count in the ‘Cases to result' decreases as per existing process.

#AC007  - NOT IMPLEMENTED - Items on another page aren't loaded.
#Scenario: items on other pages aren't selected
  #Given I am on the Outcomes work flow page(viewing cases to result tab)     
  #When I want to assign all the listed records to me that falls into more than one page
  #And I select the check box next to ‘Defendant’
  #Then only cases in the current page will be selected
  #And I can assign all the records shown in the current page   
  
#AC008
Scenario: check-all selects and deselects
  Given I am an authenticated user
  When I navigate to the "outcomes" route
  And I check the mass-action checkbox
  Then checkboxes for all cases are checked
  And I uncheck the mass-action checkbox
  Then checkboxes for all cases are not checked

#AC009 - NOT IMPLEMENTED - the feature passes the page value through to the page function
#Scenario: page number handling
  #Given I am an authenticated user
  #When I navigate to the "outcomes" route
  #And I select all the cases on 2nd page using the checkbox against ‘Defendant’
  #And cases successfully assigned to me
  #Then the control shifts to page 1 as all the cases in page 2 is moved to ‘In Progress’ tab.

#AC010 - NOT IMPLEMENTED - the feature passes the page value through to the page function
#Scenario: page number handling (2)
  #Given I am on the outcomes page, viewing the cases to result tab
  #When I have cases that are in more than one page
  #And I select a few of the cases on 2nd page using the checkbox against each case
  #And cases successfully assigned to me 
  #Then the control shifts is still on page 1