import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

When('I select to upload a document', () => {

  cy.get('.common_file_uploader input[type=file]')
    .selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.doc',
      lastModified: Date.now(),
    }, { force: true })
})

When('I drag files into the upload area', () => {

  cy.get('.common_file_uploader fieldset')
    .selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.doc',
      lastModified: Date.now(),
    }, { action: 'drag-drop' })
})

Then('I see an operating system dialogue window to select my files from', () => {
  // we can't test this in cypress!
})

Then('I see the file in the todo area', () => {

  cy.get('.common_file_uploader .container_todo >li >span')
    .contains('file.doc')
})

When('I click the upload button', () => {

  cy.get('.common_file_uploader input[type=submit]').click()
})

Then('the file is moved from the todo area to the in-progress area', () => {

  cy.get('.common_file_uploader .container_todo >li').should('not.exist')
})

Then('I see the progress of the file being uploaded', () => {
  // too fast to capture
})

When('I select to upload more than 10 documents', () => {
  cy.get('.common_file_uploader input[type=file]')
    .selectFile(Array.apply(null,Array(15))
      .map((x, i) => ({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file' + '' + '.doc',
        lastModified: Date.now()
      }))
    , { force: true }
  )
})

Then('I see 10 files in the document upload area', () => {
  cy.get('.common_file_uploader .container_todo >li').should('have.length', 10)
})

Then('I see an error message advising me I can only upload 10 documents at a time', () => {
  // this hasn't been defined by design work and wasn't implemented
})

When('I navigate to the "/B14LO/hearing/a395526d-b805-4c52-8f61-3c41bca15537/defendant/d1d38809-af04-4ff0-9328-4db39c0a3d85/summary" base route')
    
When('I select to upload a document of more than 50mb', () => {
  // file size is irrelevant, mockwire response for this endpoint is forced
  cy.get('.common_file_uploader input[type=file]')
    .selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.doc',
      lastModified: Date.now(),
    }, { force: true })
})

Then('I see an error advising me the document is too big to upload', () => {
  cy.get('.common_file_uploader >ul >li >span.error').should('have.length', 3)
})

When('I select to upload a document that is not of an accepted file type', () => {
  cy.get('.common_file_uploader input[type=file]')
    .selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.abc',
      lastModified: Date.now(),
    }, { force: true })
})

Then('I see an error advising me the document is not of a type that is accepted by MoJ', () => {
  // by default the list is filtered by the file picker and drag-drop. If the user overrides 
  // the http code for too large is passed through, so doesn't require testing.
  cy.get('.common_file_uploader .container_todo >li').should('have.length', 0)
})

When('I have successfully uploaded a document', () => {
  // no need to test, exists on particular mock data already
})

Then('I see the document name as a link', () => {
  cy.get('.common_file_uploader >ul >li >a').contains('document1.pdf')
})

Then('I see the date the document was uploaded as text', () => {
  cy.get('.common_file_uploader >ul >li >span').contains('1 January 2001')
})

Then('I see a link to delete that document', () => {
  cy.get('.common_file_uploader >ul >li >a').contains('Delete')
})

When('I select to delete that document', () => {
  cy.get('.common_file_uploader a[href="summary/files/2297d10b-d330-43e5-20c3-27ce3b469bab/delete"]').click()
  cy.on('window:confirm', () => true)
})

Then('the document is no longer visible', () => {
  cy.get('.common_file_uploader >ul >li').should('have.length', 1)
})

When('I am the subject of a Limited Access Offender Exclusions marker and I select to view an uploaded document', () => {
  cy.get('.common_file_uploader a[href="summary/files/4497d10b-d330-43e5-20c3-27ce3b469bbf/raw"]').click()
})

Then('I see an error advising me I am not able to view it', () => {
  cy.get('.govuk-main-wrapper p').contains('Error: ')
})
