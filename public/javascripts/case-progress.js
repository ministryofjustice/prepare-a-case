(function setupCaseProgressScripts() {

  const validateNotes = (element) => event => {
    let otherNotesFound = false;
    const currentForm = element.getElementsByTagName('textarea')?.item(0)?.getAttribute('id')
    document.querySelectorAll(".comments-form-tag textarea").forEach(value => {
      if (otherNotesFound) {
        return
      }
      if (value.getAttribute('id') != currentForm && value.value?.trim() != '') {
        otherNotesFound = true
      }
    })
    if (otherNotesFound) {
      alert('There are unsaved notes\nSave your notes before adding new one')
      event.preventDefault()
    }
  }

  document.querySelectorAll(".comments-form-tag").forEach(form => {
    form.addEventListener("submit", validateNotes(form));
  })
})()
