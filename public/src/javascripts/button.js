'use strict'

document.addEventListener('DOMContentLoaded', () => {
    let buttons = document.getElementsByClassName('action-button')

    Array.from(buttons).forEach(button => {
        button.form.addEventListener('submit', () => {
            button.disabled = true;
        })
    });
})
