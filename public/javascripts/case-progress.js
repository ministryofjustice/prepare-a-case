(function setupCaseProgressScripts () {
  const hasMultipleNoteBoxes = (currentNote) => {
    let multipleNoteBoxFilled = false
    const currentForm = currentNote.getAttribute('id')

    const selectedNotes = document.querySelectorAll('.case-notes')
    selectedNotes.forEach(value => {
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

  const caseNoteTextAreas = document.querySelectorAll('.case-notes')
  caseNoteTextAreas.forEach(form => {
    form.addEventListener('keypress', (event) => {
      if (hasMultipleNoteBoxes(form)) {
        popupWrapper.style.display = "block"
        event.preventDefault()
      }
    })
  })
})()