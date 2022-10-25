(function setupCaseProgressScripts() {

  const validateNotes = (element) => event => {
    let draftsFound = false;
    const selfTextArea = element.getElementsByTagName("textarea")?.item(0)?.getAttribute('id')
    document.querySelectorAll(".comments-form-tag > textarea").forEach(value => {
      if (draftsFound) {
        return
      }
      if (value.getAttribute('id') != selfTextArea && value.value?.trim() != '') {
        draftsFound = true
      }
    })
    if (draftsFound) {
      alert('You have other unsaved notes or comments which will be lost of you save this note. Please save them before saving this comment.')
      event.preventDefault()
    }
  }

  document.querySelectorAll(".comments-form-tag").forEach(elem => {
    elem.addEventListener("submit", validateNotes(elem));
  })
})()
