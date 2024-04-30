'use strict'

document.addEventListener('DOMContentLoaded', () => {

  Array.from(document.getElementsByClassName('workflow-tasks-status-selector'))
    .forEach(root => {

      let currentSelectedIndex = root.selectedIndex

      // apply 
      const apply = () => {
        if (currentSelectedIndex > -1) {
          root.classList.remove(root.options[currentSelectedIndex].dataset.cssClass)
        }
        currentSelectedIndex = root.selectedIndex
        console.log(currentSelectedIndex, root.options[currentSelectedIndex].dataset.cssClass)
        root.classList.add(root.options[currentSelectedIndex].dataset.cssClass)
      }

      // event handler
      root.addEventListener('change', async () => {
        try {
          const body = new URLSearchParams();
          body.append('state', root.value);
          const response = await window.fetch(root.dataset['formAction'], {
            method: 'post',
            body
          })
          if (!response.ok) {
            throw response
          }
          apply()
        } catch (e) {
          root.selectedIndex = currentSelectedIndex
          window.alert(`Error: Unable to change the admin prep status for ${root.dataset['defendantFullname']}. Try again`)
        }
      })
      
      // on-load default
      apply()
    })
  
})