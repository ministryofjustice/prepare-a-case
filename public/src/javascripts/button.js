'use strict'

document.addEventListener('DOMContentLoaded', () => {
    let buttons = document.getElementsByClassName('action-button')

    Array.from(buttons).forEach(button => {
        try {
            button.form.addEventListener('submit', () => {
                button.disabled = true;
            })
        } catch (e) {
            console.warn('Could not add event listener to button: ', button)
        }
    });
})
