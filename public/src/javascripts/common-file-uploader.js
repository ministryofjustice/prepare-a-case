'use strict'

document.addEventListener('DOMContentLoaded', () => {

  const statusCodes = {
    '0': 'No Connection',
    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '103': 'Early Hints',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '207': 'Multi-Status',
    '208': 'Already Reported',
    '226': 'IM Used',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '307': 'Temporary Redirect',
    '308': 'Permanent Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Payload Too Large',
    '414': 'URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': "I'm a Teapot",
    '421': 'Misdirected Request',
    '422': 'Unprocessable Entity',
    '423': 'Locked',
    '424': 'Failed Dependency',
    '425': 'Too Early',
    '426': 'Upgrade Required',
    '428': 'Precondition Required',
    '429': 'Too Many Requests',
    '431': 'Request Header Fields Too Large',
    '451': 'Unavailable For Legal Reasons',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported',
    '506': 'Variant Also Negotiates',
    '507': 'Insufficient Storage',
    '508': 'Loop Detected',
    '509': 'Bandwidth Limit Exceeded',
    '510': 'Not Extended',
    '511': 'Network Authentication Required'
  }

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
        pool.upload.length = 0
        submitDisable(!files.length)
        wipe.todo()
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
            pool.upload.push(file)
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
            xhr.timeout = 12500
            const formData = new FormData()
            formData.append('file', file)
            xhr.upload.addEventListener('progress', event => {
              if (event.lengthComputable) {
                setItemProgressPercentage(element, Math.ceil(event.loaded/event.total * 100))
              }
            })
            xhr.addEventListener('loadend', () => {

              if (xhr.status === 201) {
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
                .replace(/\[\[http\.text\]\]/g, statusCodes[String(xhr.status)] || "Unknown error")
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
