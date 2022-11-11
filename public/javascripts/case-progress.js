(function setupCaseProgressScripts () {
  const hasMultipleNoteBoxes = (form) => {
    let multipleNoteBoxFilled = false
    const currentForm = form.getElementsByTagName('textarea')?.item(0)?.getAttribute('id')

    const selectedForm = document.querySelectorAll('.comments-form-tag textarea')
    selectedForm.forEach(value => {
      console.log("this is a text area")
      if (multipleNoteBoxFilled) {
        return
      }
      if (value.getAttribute('id') !== currentForm && value.value?.trim() !== '') {
        multipleNoteBoxFilled = true
      }
    })
    return multipleNoteBoxFilled
  }

  const popupWrapper = document.getElementsByClassName('popup-wrapper')[0]

  const goBackBtn = document.getElementById('close-btn')
  console.log('goBackBtn', goBackBtn)
  goBackBtn.addEventListener('click', () => {
    console.log("hidding the pop up again...")
    popupWrapper.classList.remove('togglePopup')
  })

  const hearingForms = document.querySelectorAll('.comments-form-tag')
  hearingForms.forEach(form => {
    console.log('form', form)
    form.addEventListener('submit', (event) => {
      console.log("we're in the submit")
      if (hasMultipleNoteBoxes(form)) {
        console.log("cancelling submission (multiple boxes with text found)")

        popupWrapper.classList.remove('togglePopup')
        event.preventDefault()
        return false;
      }
      return true;
    })
  })
})()