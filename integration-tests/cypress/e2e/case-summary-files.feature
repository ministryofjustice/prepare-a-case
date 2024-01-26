Feature: Case summary File Upload
  As an authenticated user
  I want to be able to order to manage files attached to a case
  
Scenario: AC001 - file picker display
  Given I am on the case summary page 
  When I select to upload a document
  Then I see an operating system dialogue window to select my files from

Scenario: AC002 - file pick select
  Given I am on the case summary page 
  When I select to upload a document
  Then I see the file in the todo area

Scenario: AC003 - drag/drop
  Given I am on the case summary page 
  When I drag files into the upload area
  Then I see the file in the todo area

Scenario: AC004 - upload file
  Given I am on the case summary page
  When I select to upload a document
  And I click the upload button
  Then the file is moved from the todo area to the in-progress area
  And I see the progress of the file being uploaded

Scenario: AC005 - limit file upload count
  Given I am on the case summary page 
  When I select to upload more than 10 documents 
  Then I see 10 files in the document upload area
  And I see an error message advising me I can only upload 10 documents at a time 

Scenario: AC006 - file size error
  When I navigate to the "/B14LO/hearing/a395526d-b805-4c52-8f61-3c41bca15537/defendant/d1d38809-af04-4ff0-9328-4db39c0a3d85/summary" base route
  When I select to upload a document of more than 50mb
  And I click the upload button
  Then I see an error advising me the document is too big to upload

Scenario: AC007 - file type selection
  Given I am on the case summary page
  When I select to upload a document that is not of an accepted file type
  Then I see an error advising me the document is not of a type that is accepted by MoJ

Scenario: AC008 - file details
  Given I am on the case summary page 
  When I have successfully uploaded a document  
  Then I see the document name as a link
  And I see the date the document was uploaded as text
  And I see a link to delete that document

Scenario: AC009 - file delete
  Given I am on the case summary page 
  When I have successfully uploaded a document  
  And I select to delete that document 
  Then the document is no longer visible

@ignore
Scenario: AC010 - restricted to defendant
  Given there are two defendants on a case
  When I save a document on the case summary page for defendant 1
  Then I will not see that document on the case summary page for defendant 2 

Scenario: AC011 - restricted read access
  Given I am on the case summary page 
  When I am the subject of a Limited Access Offender Exclusions marker and I select to view an uploaded document
  Then I see an error advising me I am not able to view it