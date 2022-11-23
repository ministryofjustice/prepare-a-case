(function setupCaseProgressScripts () {
  const hasMultipleNoteBoxes = (form) => {
    let multipleNoteBoxFilled = false
    const currentForm = form.getElementsByTagName('textarea')?.item(0)?.getAttribute('id')

    const selectedForm = document.querySelectorAll('.comments-form-tag textarea')
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

  const hearingForms = document.querySelectorAll('.comments-form-tag')
  hearingForms.forEach(form => {
    form.addEventListener('keydown', (event) => {
      if (hasMultipleNoteBoxes(form)) {
        popupWrapper.style.display = "block"
        event.preventDefault()
      }
    })
  })
})()