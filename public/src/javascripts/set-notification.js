(function setupSetNotificationScripts () {


  const form = document.getElementById('notificationForm')
  const iframe = document.getElementById('render')
  const input = document.getElementById('notification')
  const notificationError = document.getElementById('notification-error-text')
  const submitBtn = form.querySelector('button[type=submit]')


  const errMsg = form.querySelector('.govuk-error-message')
  const formGroup = form.querySelector('.govuk-form-group')

  const hideErrors = () => {
    errMsg.classList.add('govuk-!-display-none')
    formGroup.classList.remove('govuk-form-group--error')
    input.classList.remove('govuk-input--error')
    submitBtn.disabled = false
  }

  const showErrors = () => {
    errMsg.classList.remove('govuk-!-display-none')
    formGroup.classList.add('govuk-form-group--error')
    input.classList.add('govuk-input--error')
    submitBtn.disabled = true
  }

  const validateHTML = htmlString => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'application/xml')
      const errorNode = doc.querySelector('parsererror div')

    notificationError.innerHTML = ''
    if (errorNode) {
      notificationError.innerText = errorNode.innerText
      showErrors()
    } else {
      hideErrors()
    }
  }

  iframe.addEventListener('load', () => {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px'
    iframe.contentWindow.document.getElementsByTagName('html')[0].style.overflow = 'hidden'
    iframe.contentWindow.document.querySelector('.govuk-notification-banner').addEventListener('click', ev => ev.preventDefault())
    const ev = new Event('input', { bubbles: true })
    input.dispatchEvent(ev)
    form.classList.remove('hide-errors')
  });



  function reRenderTemplate() {
    const preview = iframe.contentWindow.document.getElementById('preview-render')
    preview.innerHTML = this.value
    iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px'
    // text input is not HTML, so we need to wrap it in a span to validate
    validateHTML('<span>' + this.value + '</span>')
  }

  input.addEventListener('input', reRenderTemplate)

})()
