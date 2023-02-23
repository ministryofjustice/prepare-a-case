(function setupCaseProgressScripts () {

  const hasMultipleNoteBoxes = (form) => {
    let multipleNoteBoxFilled = false
    const currentForm = form.getAttribute('id')


    const selectedForm = document.querySelectorAll('.case-notes')
    selectedForm.forEach(value => {
      if (multipleNoteBoxFilled) {
        return
      }
      if (value.getAttribute('id') !== currentForm && value.value?.trim() !== '') {
        multipleNoteBoxFilled = true
      }
    })
    return multipleNoteBoxFilled
  }

  const popupWrapper = document.getElementById('popup-wrapper')

  const goBackBtn = document.getElementById('close-btn')
  goBackBtn.addEventListener('click', () => {
    popupWrapper.style.display = "none"
  })

  const hearingForms = document.querySelectorAll('.case-notes')
  hearingForms.forEach(form => {
    form.addEventListener('keypress', (event) => {
      if (hasMultipleNoteBoxes(form)) {
        popupWrapper.style.display = "block"
        event.preventDefault()
      }
    })
  })

  const getNotEditHandler = (noteReadonly, noteEditContainer, noteReadonlyText, noteEditText, editing) => {

    const handler = (event) => {
      if (editing) {
        noteEditText.innerText = noteReadonlyText.innerText
        noteReadonly.setAttribute('hidden', true)
        noteEditContainer.removeAttribute('hidden')
        event.preventDefault()
      } else {
        noteReadonlyText.innerText = noteEditText.innerText
        noteReadonly.removeAttribute('hidden')
        noteEditContainer.setAttribute('hidden', true)
        event.preventDefault()
      }
    }
    return handler
  }

  const noteContainers = document.querySelectorAll('.hearing-note-container');

  noteContainers.forEach(noteContainer => {
    const noteReadonly = noteContainer.querySelector('.hearing-note-display')
    const noteReadonlyText = noteReadonly.querySelector('.hearing-note-display-text')

    const noteEditContainer = noteContainer.querySelector('.note-edit-container')
    const noteEditTextArea = noteEditContainer.querySelector('.case-notes-edit')
    const noteEditLink = noteEditContainer.querySelector('.note-edit-link')
    const noteEditDoneLink = noteEditContainer.querySelector('.hearing-note-edit-done')
    noteEditLink.addEventListener('click', getNotEditHandler(noteReadonly, noteEditContainer, noteReadonlyText, noteEditTextArea, true))
    noteEditDoneLink.addEventListener('click', getNotEditHandler(noteReadonly, noteEditContainer, noteReadonlyText, noteEditTextArea, false))
  })

})()
