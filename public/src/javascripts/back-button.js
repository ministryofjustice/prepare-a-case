'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementsByClassName('govuk-back-link');
    if (button.length > 0) {
        button[0].addEventListener('click', (event) => {
            event.preventDefault();
            window.history.back();
        });
    }
});
