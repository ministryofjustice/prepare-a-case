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

  function getAutoSaveHandler(textarea) {
    let noteId = textarea.getAttribute('id')
    let timeoutId;

    const noteEventListener = (event) => {
      // If a timer was already started, clear it.
      if (timeoutId) clearTimeout(timeoutId);

      // Set timer that will save comment when it fires.
      timeoutId = setTimeout(function () {
        // Make ajax call to save data.
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'summary/auto-save', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('x-csrf-token', window.csrfToken)
        xhr.onload = function () {
          console.log("****************** ", this.status)
          // this.status >= 200 && this.status < 400 ? hideError() : showError()
          if(this.status === 200) {
            if (!noteId) {
              noteId = this.response.noteId
              textarea.setAttribute("id", "note_" + noteId)
            }
          }
        }
        xhr.send(
          JSON.stringify([
            {
              value: event.srcElement.value,
              noteId
            },
          ])
        )
      }, 1000);
    }

    return noteEventListener
  }

  const hearingForms = document.querySelectorAll('.case-notes')
  hearingForms.forEach(form => {
    form.addEventListener('keypress', getAutoSaveHandler(form))
  })
})()
