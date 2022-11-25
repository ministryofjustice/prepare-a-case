(function setupCaseProgressScripts () {
  const checkIfOneOrMoreTextareaAreFilled__returnStatus = (textarea) => {

    let textareaStatus = undefined
    const currentTextarea = textarea.getAttribute('id')

    const checkTheStateOfOneOrMoreTextarea = document.querySelectorAll('.textarea-container')
    checkTheStateOfOneOrMoreTextarea.forEach(uniqueTextarea => {

      if (textareaStatus) {
        return
      }
      if (uniqueTextarea.getAttribute('id') !== currentTextarea && uniqueTextarea.value?.trim() !== '') {
        textareaStatus = uniqueTextarea
      }
    })
    return textareaStatus
  }

  const modalContainer = document.getElementById('popup-wrapper')
  const modalTitleMessage = document.getElementById('modal-title-message')
  const modalBodyMessage = document.getElementById('modal-body-message')

  const goBackBtn = document.getElementById('close-btn')
  goBackBtn.addEventListener('click', () => {
    modalContainer.style.display = "none"
  })


  const multipleTextareaFilled__displayModal = document.querySelectorAll('.textarea-container')
  multipleTextareaFilled__displayModal.forEach(textarea => {
    textarea.addEventListener('keypress', (event) => {
      const textareaUpdated = checkIfOneOrMoreTextareaAreFilled__returnStatus(textarea)
      if (textareaUpdated) {
        if(textareaUpdated.id === 'comment' ){
          modalTitleMessage.textContent = "There are unsaved comments"
          modalBodyMessage.textContent = "Save your comment before adding a new one."
        } else {
          modalTitleMessage.textContent = "There are unsaved notes"
          modalBodyMessage.textContent = "Save your note before adding a new one."
        }
        modalContainer.style.display = "block"
        event.preventDefault()
      }
    })
  })
})()
