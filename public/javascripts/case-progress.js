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

  const getNotEditHandler = (hearingNoteDisplayContainer, noteEditContainer, noteReadonlyText, noteEditText, editing) => {
    const trackEvent = (name, properties) => {
      if (window && window.appInsights && window.appInsights.trackEvent && name) {
        window.appInsights.trackEvent({ name, properties })
        window.appInsights.flush()
      }
    }
    const originalText = noteReadonlyText.innerText
    const handler = (event) => {
      event.preventDefault()
      if (editing) {
        trackEvent('PiCEditNoteStarted', { hearingId: noteEditText.dataset.hearingid, noteId: noteEditText.dataset.noteid })
        noteEditText.value = noteReadonlyText.innerText
        hearingNoteDisplayContainer.setAttribute('hidden', true)
        noteEditContainer.removeAttribute('hidden')
      } else {
        trackEvent('PiCEditNoteCancel', { hearingId: noteEditText.dataset.hearingid, noteId: noteEditText.dataset.noteid })
        noteEditText.value = ''
        noteReadonlyText.innerText = originalText
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
      const noteEditCancelLink = noteEditContainer.querySelector('.note-edit-cancel-link')
      noteEditLink.addEventListener('click', getNotEditHandler(hearingNoteDisplayContainer, noteEditContainer, noteReadonlyText, noteEditTextArea, true, noteEditCancelLink))
      noteEditCancelLink.addEventListener('click', getNotEditHandler(hearingNoteDisplayContainer, noteEditContainer, noteReadonlyText, noteEditTextArea, false))
    }
  })

})()
