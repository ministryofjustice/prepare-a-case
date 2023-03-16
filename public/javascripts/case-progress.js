(function setupCaseProgressScripts () {

  // The timer before saving the draft note after the user paused typing
  const debounceTimer = 1000;

  function getAutoSaveHandler(textarea) {
    const hearingId = textarea.dataset.hearingid
    let timeoutId;

    const noteEventListener = (event) => {
      // If a timer was already started, clear it.
      if (timeoutId) clearTimeout(timeoutId);
      // Set timer that will save comment when it fires.
      timeoutId = setTimeout(function () {
        // Make ajax call to save data.
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'summary/auto-save-new-note', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('x-csrf-token', window.csrfToken)
        xhr.onload = function () {
          if (this.status < 200 || this.status >= 400) {
            console.log("Error status", this.status)
          }
        }
        xhr.send(
          JSON.stringify(
            {
              note: event.srcElement.value,
              hearingId
            },
          )
        )
      }, debounceTimer);
    }
    return noteEventListener
  }

  const setupAutoSave = (textarea) => {
    textarea.addEventListener('keypress', getAutoSaveHandler(textarea))
  }

  document.querySelectorAll('.auto-save-text').forEach(setupAutoSave)


  // Edit note

  function getHearingNoteEditsAutoSaveHandler(textarea, noteEditDoneLink) {
    const hearingId = textarea.dataset.hearingid
    const noteId = textarea.dataset.noteid
    let timeoutId;
    let apiCallCount = 0

    const noteEventListener = (event) => {
      // If a timer was already started, clear it.
      if (timeoutId) clearTimeout(timeoutId);
      // Set timer that will save comment when it fires.
      timeoutId = setTimeout(function () {
        // Make ajax call to save data.
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'summary/auto-save-note-edits', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('x-csrf-token', window.csrfToken)
        xhr.onload = function () {
          apiCallCount--
          if (this.status < 200 || this.status >= 400) {
            console.log("Error status", this.status)
          }
          if(apiCallCount === 0) {
            noteEditDoneLink.classList.remove('govuk-button--disabled')
            noteEditDoneLink.removeAttribute('disabled')
          }
        }
        noteEditDoneLink.setAttribute('disabled', true)
        noteEditDoneLink.classList.add('govuk-button--disabled')
        xhr.send(
          JSON.stringify(
            {
              note: event.srcElement.value,
              hearingId,
              noteId
            },
          )
        )
        apiCallCount++
      }, debounceTimer);
    }
    return noteEventListener
  }

  const getNotEditHandler = (hearingNoteDisplayContainer, noteEditContainer, noteReadonlyText, noteEditText, editing, noteEditDoneLink) => {

    const handler = (event) => {
      event.preventDefault()
      if (editing) {
        noteEditText.value = noteReadonlyText.innerText
        hearingNoteDisplayContainer.setAttribute('hidden', true)
        noteEditText.addEventListener('keypress', getHearingNoteEditsAutoSaveHandler(noteEditText, noteEditDoneLink))
        noteEditContainer.removeAttribute('hidden')
      } else {
        noteReadonlyText.innerText = noteEditText.value
        hearingNoteDisplayContainer.removeAttribute('hidden')
        noteEditContainer.setAttribute('hidden', true)
      }
    }
    return handler
  }

  const noteContainers = document.querySelectorAll('.hearing-note-container');

  noteContainers.forEach(noteContainer => {
    const hearingNoteDisplayContainer = noteContainer.querySelector('.hearing-note-display')
    const noteEditLink = hearingNoteDisplayContainer.querySelector('.note-edit-link')
    if (noteEditLink) {
      const noteReadonlyText = hearingNoteDisplayContainer.querySelector('.hearing-note-display-text')

      const noteEditContainer = noteContainer.querySelector('.note-edit-container')
      const noteEditTextArea = noteEditContainer.querySelector('.case-notes-edit')
      const noteEditDoneLink = noteEditContainer.querySelector('.hearing-note-edit-done')
      noteEditLink.addEventListener('click', getNotEditHandler(hearingNoteDisplayContainer, noteEditContainer, noteReadonlyText, noteEditTextArea, true, noteEditDoneLink))
      noteEditDoneLink.addEventListener('click', getNotEditHandler(hearingNoteDisplayContainer, noteEditContainer, noteReadonlyText, noteEditTextArea, false))
    }
  })

})()
