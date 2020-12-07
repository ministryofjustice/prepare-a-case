(function setupFilterComponent () {

  'use strict'

  function resizeFilterSections () {
    var filterButtons = document.getElementsByClassName('pac-filter-button')
    var filterSections = document.getElementsByClassName('pac-filter-selection')
    Array.prototype.forEach.call(filterSections, function (element, index) {
      element.classList.remove('moj-js-hidden')
      filterButtons[index].style.width = element.offsetWidth > 1 ? element.offsetWidth + 'px' : filterButtons[index].style.width
      element.classList.add('moj-js-hidden')
    })
  }

  function configureFilterButtons () {
    var filterButtons = document.getElementsByClassName('pac-filter-button')
    var main = document.getElementsByClassName('govuk-main-wrapper')

    function toggleFilter (e) {
      e.stopPropagation()
      var $el = e.target
      var current = !$el.active && $el.dataset['controls']
      var filterSections = document.getElementsByClassName('pac-filter-selection')
      Array.prototype.forEach.call(filterButtons, function (element, index) {
        current === element.dataset['controls'] ? element.classList.add('pac-filter-button--open') : element.classList.remove('pac-filter-button--open')
        current === filterSections[index].id ? filterSections[index].classList.remove('moj-js-hidden') : filterSections[index].classList.add('moj-js-hidden')
        if (!$el.active) {
          element.active = false
        }
      })
      $el.active = !$el.active
    }

    Array.prototype.forEach.call(filterButtons, function (element) {
      element.addEventListener('click', toggleFilter)
    })

    Array.prototype.forEach.call(main, function (element) {
      element.addEventListener('click', toggleFilter)
    })
  }

  function configureClearTags () {
    function clearFilter (e) {
      e.stopPropagation()
      var checkbox = document.getElementById(e.target.dataset['controls'])
      checkbox.click()
      document.getElementById('pac-filter-form').submit()
    }

    var clearTags = document.getElementsByClassName('moj-filter__tag pac-filter__tag')
    Array.prototype.forEach.call(clearTags, function (element) {
      element.addEventListener('click', clearFilter)
    })
  }

  function configureCheckboxes () {
    function checkboxClick (e) {
      e.stopPropagation()
      var button = document.getElementById('button-' + e.target.name.substring(e.target.name.indexOf('-') + 1))
      var anySelected = false
      var checkboxesInGroup = document.querySelectorAll('[id^="checkbox-' + e.target.name + '"]')
      Array.prototype.forEach.call(checkboxesInGroup, function (element) {
        anySelected = anySelected || element.checked
      })
      anySelected ? button.classList.add('pac-filter-button--selected') : button.classList.remove('pac-filter-button--selected')
    }

    var checkboxes = document.getElementsByClassName('pac-filter-checkbox')
    Array.prototype.forEach.call(checkboxes, function (element) {
      element.addEventListener('click', checkboxClick)
    })
  }

  function configureResetButton () {
    function resetFilters (e) {
      e.stopPropagation()
      var form = document.getElementById('pac-filter-form')
      var checkboxes = document.getElementsByClassName('pac-filter-checkbox')
      Array.prototype.forEach.call(checkboxes, function (element) {
        if (element.checked) {
          element.click()
        }
      })
      form.submit()
    }

    var resetBtn = document.getElementById('reset-filters')
    resetBtn.addEventListener('click', resetFilters)
  }

  resizeFilterSections()
  configureFilterButtons()
  configureClearTags()
  configureCheckboxes()
  configureResetButton()

})()
