import 'bootstrap/js/dist/modal'
import $ from 'jquery/src/jquery'
import { initAll as govuk } from 'govuk-frontend'
import { Accordion } from 'govuk-frontend'
import { initAll as moj } from '@ministryofjustice/frontend/moj/all.mjs'
import '../src/javascripts/caselist-date-carousel'

// govuk() - will break tabs which is why it wasn't previously enabled
window.$ = $
moj()

document.body.classList.add('js-enabled')

/* 
  WARN: Re-implementation of the govuk init all function, this will need reviewing if the package is updated
  Use to only initialise the accordion, as there are conflicts with the MOJ frontend for other components.
  This can be expanded to add other specific components, by importing them and adding them to the components array below
*/
function initAccordian(config) {
  let _config$scope;
  config = typeof config !== 'undefined' ? config : {};

  const components = [[Accordion, config.accordion]];
  const $scope = (_config$scope = config.scope) != null ? _config$scope : document;
  components.forEach(([Component, config]) => {
    const $elements = $scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
    $elements.forEach($element => {
      try {
        'defaults' in Component ? new Component($element, config) : new Component($element);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

initAccordian()