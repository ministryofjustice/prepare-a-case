'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const outcomeToggleButtons = document.querySelectorAll('[data-outcome-toggle-button]')

    outcomeToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            outcomeToggleButtons.forEach(btn => {
                const wrapper = document.createElement('span')
                wrapper.style.cursor = 'not-allowed'
                wrapper.style.display = 'inline-block'

                btn.parentNode.insertBefore(wrapper, btn)
                wrapper.appendChild(btn)

                btn.style.pointerEvents = 'none'
                btn.style.opacity = '0.5'
                btn.setAttribute('aria-disabled', 'true')
                btn.classList.add('govuk-button--disabled')
            })
        })
    })
})
