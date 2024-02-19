'use strict'

document.addEventListener('DOMContentLoaded', () => {

  Array.from(document.getElementsByClassName('common_checker_toggle'))
    .forEach(root => {

      let checked = false
      const checkboxes = Array.from(root.getElementsByClassName('common_checker_toggle_item'))
        .map(element => element.getElementsByTagName('input')[0])
      const appliers = Array.from(root.getElementsByClassName('common_checker_toggle_apply'))
        .map(element => element.getElementsByTagName('input')[0])
      const actions = Array.from(root.getElementsByClassName('common_checker_toggle_action'))

      // determines if anything is checked and adds flag to the root
      const checkState = () => {
        const state = checkboxes
          .some(checkbox => checkbox.checked)
        root.setAttribute('data-checker-toggle-state-has-one', state)
        actions
          .forEach(action => action.disabled = !state)
      }

      // apply to all checkboxes on apply action
      appliers
        .forEach(element => {
          element.addEventListener('click', () => {
            checked = !checked
            checkboxes
              .forEach(checkbox => checkbox.checked = checked)
            checkState()
          })
        })

      // add state check to all item checkboxes
      checkboxes
        .forEach(checkbox => checkbox.addEventListener('click', checkState))

      // default state
      checkState()
    })
})