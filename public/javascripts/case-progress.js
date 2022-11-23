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
    console.log(form, "here the form when appearing on the page")
    form.addEventListener('keypress', (event) => {
      console.log(form, "When I press a key in a note")
      if (hasMultipleNoteBoxes(form)) {
        console.log(form, "check if there is multiple box")
        popupWrapper.style.display = "block"
        console.log(popupWrapper, "popupWrapper")
        event.preventDefault()
      }
    })
  })
})()
