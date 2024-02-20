'use strict'

document.addEventListener('DOMContentLoaded', () => {

  const removeElementsFromDOM = elements => elements
    .forEach(item => item.remove())

  const setItemProgressPercentage = (element, value) => {
    Array.from(element.querySelectorAll('*[data-percentage]'))
      .forEach(element => element.textContent = value)
  }

  const actionDeleteConfirm = element => {

    Array.from(element.querySelectorAll('*[data-event-click-confirm]'))
      .forEach(clicker => {
        clicker.addEventListener('click', async event => {
          event.preventDefault()
          if (window.confirm('Are you sure you want to delete this file?')) {
            try {
              const response = await fetch(clicker.href)
              if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
              }
              element.remove()
            } catch (e) {
              const message = e.message || 'Unknown Error'
              alert(`${message}\n\nAn error occured while deleting the file.`)
            }
          }
        })
      })
  }

  Array.from(document.getElementsByClassName('common_file_uploader'))
    .forEach(root => {

      const form = root.querySelector('form')
      const fieldset = form.getElementsByTagName('fieldset')[0]
      const picker = form.querySelector('input[type="file"]')
      const choose = form.querySelector('button')
      const submit = form.querySelector('input[type="submit"]')

      const config = {
        select: {
          max: Number(picker.getAttribute('data-maxselect')),
          accept: picker.getAttribute('accept').split(',')
        }
      }
 
      // existing files
      Array.from(root.querySelectorAll('*[data-item-exists]'))
        .forEach(actionDeleteConfirm)

      const pool = {
        todo: [],
        errors: [],
        inprogress: [],
        upload: []
      }

      const wipe = {
        todo: () => {
          removeElementsFromDOM(pool.todo)
          pool.todo.length = 0;
        },
        errors: () => {
          removeElementsFromDOM(pool.errors)
          pool.errors.length = 0;
        }
      }

      const templates = [
        'todo_item',
        'success',
        'error',
        'inprogress'
      ].reduce((o, name) => {
        o[name] = root.querySelector(`template[data-id="${name}"]`)
        return o
      }, {})
        
      const submitDisable = disable => {
        submit.disabled = disable
        submit.classList.toggle('govuk-button--disabled', disable)
        submit.setAttribute('aria-disabled', disable)
      }

      /* Adds files from different data sources */
      const addFiles = files => {
        pool.upload.length = 0;
        pool.upload.push(...files)
        submitDisable(!files.length)
        wipe.todo();
        Array.from(files)
          .slice(0, config.select.max)
          .filter(({ name, type }) => 
            config.select.accept.includes(type) ||
            (config.select.accept.includes('.' + name.split('.').pop()) &&
              name.split('.').pop() !== name
            )
          )
          .forEach(file => {
            const element = document.createElement('li')
            element.innerHTML = templates.todo_item.innerHTML
              .replace(/\[\[file\.name\]\]/g, file.name)
            templates.todo_item.after(element)
            pool.todo.push(element)
          })
      }

      /* event handlers */

      form.addEventListener('submit', event => {
        event.preventDefault()
        submitDisable(true)
        wipe.todo();
        wipe.errors();
        Array.from(pool.upload)
          .forEach(file => {
            // initial progress
            const element = document.createElement('li')
            element.innerHTML = templates.inprogress.innerHTML
              .replace(/\[\[file\.name\]\]/g, file.name)
            setItemProgressPercentage(element, 0)
            templates.inprogress.after(element)
            // upload
            const xhr = new XMLHttpRequest()
            const formData = new FormData()
            formData.append('file', file)
            xhr.upload.addEventListener('progress', event => {
              if (event.lengthComputable) {
                setItemProgressPercentage(element, Math.round(event.loaded/event.total))
              }
            })
            xhr.addEventListener('loadend', () => {

              if (xhr.status === 200) {
                const { datetime, id } = JSON.parse(xhr.response)
                element.innerHTML = templates.success.innerHTML
                  .replace(/\[\[file\.name\]\]/g, file.name)
                  .replace(/\[\[datetime\]\]/g, datetime)
                  .replace(/\[\[id\]\]/g, id)
                templates.success.after(element)
                actionDeleteConfirm(element)
                return
              }
              // error
              element.innerHTML = templates.error.innerHTML
                .replace(/\[\[file\.name\]\]/g, file.name)
                .replace(/\[\[http\.code\]\]/g, xhr.status)
                .replace(/\[\[http\.text\]\]/g, xhr.statusText)
              templates.error.after(element)
              pool.errors.push(element)
            })
            xhr.open('POST', form.action)
            xhr.send(formData)
          })
        form.reset()
      })

      choose.addEventListener('click', event => {
        event.preventDefault()
        picker.click()
      })

      picker.addEventListener('change', () => {
        addFiles(picker.files)
      })
    
      fieldset.addEventListener('dragover', event => {
        event.preventDefault()
      })

      fieldset.addEventListener('drop', event => {
        event.preventDefault()
        addFiles(event.dataTransfer.files)
      })

      // defaults
      submitDisable(true)
    })
})