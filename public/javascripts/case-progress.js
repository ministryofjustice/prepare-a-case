(function setupCaseProgressScripts () {

  // The timer before saving the draft note after the user paused typing
  const debounceTimer = 1000;

  function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
    return cookie[name];
  }

  function getAutoSaveHandler(textarea, url, inputDataFormatter) {
    let timeoutId;
    const noteEventListener = (event) => {
      // If a timer was already started, clear it.
      if (timeoutId) clearTimeout(timeoutId);
      // Set timer that will save comment when it fires.
      timeoutId = setTimeout(function () {
        // Make ajax call to save data.
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', url, true)
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
              ...inputDataFormatter(textarea, event)
            },
          )
        )
      }, debounceTimer);
    }
    return noteEventListener
  }

  const setupAutoSaveHearingNote = (textarea) => {
    textarea.addEventListener('keyup', getAutoSaveHandler(textarea,  'summary/auto-save-new-note', (textarea, event) => ({ note: event.srcElement.value, hearingId: textarea.dataset.hearingid }) ))
  }

  document.querySelectorAll('.auto-save-text').forEach(setupAutoSaveHearingNote)

  const caseCommentsTextArea = document.querySelector('#case-comment');
  caseCommentsTextArea?.addEventListener('keyup',
    getAutoSaveHandler(caseCommentsTextArea,  'summary/comments/auto-save-new-comment', (textarea, event) => ({ comment: event.srcElement.value, caseId: textarea.dataset.caseid }) ))


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
        noteEditText.value = noteReadonlyText.innerText
        hearingNoteDisplayContainer.setAttribute('hidden', true)
        noteEditContainer.removeAttribute('hidden')
      } else {
        noteEditText.value = ''
        noteReadonlyText.innerText = originalText
        hearingNoteDisplayContainer.removeAttribute('hidden')
        noteEditContainer.setAttribute('hidden', true)
      }
      trackEvent(editing ? 'PiCEditNoteStarted' : 'PiCEditNoteCancel', { 
          hearingId: noteEditText.dataset.hearingid, 
          noteId: noteEditText.dataset.noteid,
          courtCode: getCookie('currentCourt')
        }
      )
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

  // ---- Case Workflow add/edit hearing outcome START
  const hideErrors = (modal) => {
    modal.querySelector('.hearing-outcome-modal-error').classList.add('govuk-!-display-none')
    modal.querySelector('.modal-error-wrapper').classList.remove('govuk-form-group--error')
  }

  document.querySelectorAll('.modal.outcome').forEach(modal => {

    modal.addEventListener('shown.bs.modal', event => {
      const outcomeModal = event.target
      const outcomeModalForm = outcomeModal.querySelector('form')
      const targetHearingIdInput = outcomeModalForm.querySelector('input[name=targetHearingId]')
      targetHearingIdInput.value = event.relatedTarget.dataset.hearingid
      const selectInput = outcomeModalForm.querySelector('select')
      selectInput.focus()
    })

    modal.addEventListener('hidden.bs.modal', event => {
      const outcomeModal = event.target
      // reset the form
      hideErrors(outcomeModal)
      outcomeModal.querySelector('select').value = ''
    })

    modal.querySelector('form').addEventListener('submit', event => {
      const modalForm = event.target
      const selectInput = modalForm.querySelector('select')
      const hearingOutcomeError = modalForm.querySelector('.hearing-outcome-modal-error')
      if (selectInput.value === '') {
        event.preventDefault()
        hearingOutcomeError.classList.remove('govuk-!-display-none')
        modalForm.querySelector('.modal-error-wrapper').classList.add('govuk-form-group--error')
      }
    })

    modal.querySelector('form select').addEventListener('change', event => {
      const modalForm = event.target.form;
      if (event.target.value !== '') {
        hideErrors(modalForm)
      }
    })
  })
  // ---- Case Workflow add/edit hearing outcome END

  // ---- Assign Modal START
  const assignOutcomeModal = document.querySelector("#assign-outcome-modal")

  if(assignOutcomeModal) {
    const assignOutcomeModalCloseButton = assignOutcomeModal.getElementsByClassName("modal-close")[0]
    const assignOutcomeForm = assignOutcomeModal.querySelector("#assign-outcome-form-row")
    const assignOutcomeViewLink = assignOutcomeModal.querySelector("#assign-outcome-view")
    const targetDefendantIdInput = assignOutcomeForm.querySelector('#targetDefendantId')
    const targetCourtCodeInput = assignOutcomeForm.querySelector('#targetCourtCode')

    assignOutcomeModalCloseButton.onclick = () => {
      assignOutcomeModal.style.display = "none"
    }

    document.querySelector('#hearing-outcome')?.addEventListener('click', (event) => {
      const target = event.target
      if (!target.classList.contains('pac-assign')) return

      event.preventDefault()

      const viewLink = `/${target.dataset.courtcode}/hearing/${target.dataset.hearingid}/defendant/${target.dataset.defendantid}/summary`
      const submitLink = `/${target.dataset.courtcode}/outcomes/hearing/${target.dataset.hearingid}/assign`
      
      targetDefendantIdInput.value = target.dataset.defendantid
      targetCourtCodeInput.value = target.dataset.courtcode
      assignOutcomeForm.setAttribute('action', submitLink)
      assignOutcomeViewLink.href = viewLink
      assignOutcomeModal.style.display = "block"
    })
  }
  // ---- Assign Modal End

  // --- case comments edit START
  document.querySelector('#caseComments')?.addEventListener('click', (event) => {
    const eventClassList = event.target.classList;
    if (!eventClassList.contains('case-comment-edit') && !eventClassList.contains('case-comment-edit-cancel')) return

    event.preventDefault()
    const commentId = event.target.dataset.commentid
    const commentRow = document.querySelector(`#case-comment-row-${commentId}`)

    const commentDisplayContainer = commentRow.querySelector(`#case-comment-display-${commentId}`);
    const commentEditContainer = commentRow.querySelector(`#case-comment-edit-${commentId}`)

    if (eventClassList.contains('case-comment-edit')) {
      commentRow.querySelector(`#case-comment-edit-textarea-${commentId}`).value = commentRow.querySelector(`#case-comments-comment-display-${commentId}`).innerText
      commentDisplayContainer.classList.add('govuk-!-display-none')
      commentEditContainer.classList.remove('govuk-!-display-none')
    } else if (eventClassList.contains('case-comment-edit-cancel')) {
      commentDisplayContainer.classList.remove('govuk-!-display-none')
      commentEditContainer.classList.add('govuk-!-display-none')
    } else {
      return
    }
  })
  // --- case comments edit END
})()
