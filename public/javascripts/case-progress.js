(function setupCaseProgressScripts () {

  // The timer before saving the draft note after the user paused typing
  const debounceTimer = 2000;

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
        xhr.open('POST', 'summary/auto-save', true)
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

  const hearingForms = document.querySelectorAll('.auto-save-text')
  hearingForms.forEach(form => {
    form.addEventListener('keypress', getAutoSaveHandler(form))
  })
})()
