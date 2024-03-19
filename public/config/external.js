import 'bootstrap/js/dist/modal'
import $ from 'jquery/src/jquery'
import { initAll as govuk } from 'govuk-frontend/dist/govuk/all.mjs'
import { initAll as moj, ButtonMenu } from '@ministryofjustice/frontend/moj/all'
import '../src/javascripts/caselist-date-carousel'

// govuk() - will break tabs which is why it wasn't previously enabled
window.$ = $
moj()
govuk()

document.body.classList.add('js-enabled')

document.addEventListener('DOMContentLoaded', () => {
 
  // MOJ Action Button Widget
  Array.from(document.querySelectorAll(".moj-button-menu"))
    .forEach(container => new ButtonMenu({
      container,
      mq: "(min-width: 200em)",
      buttonText: "Actions",
      menuClasses: "moj-button-menu__wrapper--right",
      buttonClasses: "govuk-button--secondary moj-button-menu__toggle-button--secondary"
    }))
})