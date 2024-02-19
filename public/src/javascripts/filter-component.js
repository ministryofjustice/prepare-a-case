;(function setupFilterComponent () {
  'use strict'

  function resizeFilterSections () {
    var filterButtons = document.getElementsByClassName('pac-filter-button')
    var filterSections = document.getElementsByClassName('pac-filter-selection')
    Array.prototype.forEach.call(filterSections, function (element, index) {
      element.classList.remove('moj-js-hidden')
      filterButtons[index].style.width =
        element.offsetWidth > 1
          ? element.offsetWidth + 'px'
          : filterButtons[index].style.width
      element.classList.add('moj-js-hidden')
    })
  }

  function configureFilterButtons () {
    const filterSelectionClass = 'pac-filter-selection'
    const filterButtonClass = 'pac-filter-button'
    const filterButtonOpenClass = 'pac-filter-button--open'
    const filterContainerClass = 'pac-filter-container'
    const mojHiddenClass = 'moj-js-hidden'

    const filterButtons = document.getElementsByClassName(filterButtonClass)
    const filterSections = document.getElementsByClassName(filterSelectionClass)
    var main = document.getElementsByClassName('govuk-main-wrapper')

    function toggleFilter (e) {
      e.stopPropagation()

      const isFilterButton =
        e.target.classList !== undefined &&
        Array.from(e.target.classList).includes(filterButtonClass)

      const isInsideFilterContainer = elementHasParentWithClass(
        e.target,
        filterContainerClass
      )

      if (!e.target.active && isFilterButton) {
        openFilterMenu(e.target.id)
      } else if (!isInsideFilterContainer) {
        closeAllFilters()
      }
    }

    function elementHasParentWithClass (element, targetClass) {
      const parents = getAllParents(element)
      let hasTarget = false
      parents.forEach(element => {
        if (Array.from(element.classList).includes(targetClass)) {
          hasTarget = true
        }
      })

      return hasTarget
    }

    function getAllParents (element) {
      var a = element
      var elements = []
      while (a) {
        elements.unshift(a)
        a = a.parentElement
      }

      return Array.from(elements)
    }

    function openFilterMenu (filterButtonId) {
      const filterButtonArray = Array.from(filterButtons)
      const filterSectionsArray = Array.from(filterSections)
      const targetButtonIndex = filterButtonArray.findIndex(
        p => p.id === filterButtonId
      )

      filterButtons[targetButtonIndex].classList.add(filterButtonOpenClass)
      filterButtons[targetButtonIndex].active = true
      filterSections[targetButtonIndex].classList.remove(mojHiddenClass)

      filterButtonArray.splice(targetButtonIndex, 1)
      filterSectionsArray.splice(targetButtonIndex, 1)

      filterButtonArray.forEach(element => {
        element.classList.remove(filterButtonOpenClass)
        element.active = false
      })

      filterSectionsArray.forEach(element => {
        element.classList.add(mojHiddenClass)
      })
    }

    function closeAllFilters () {
      Array.from(filterButtons).forEach(element => {
        element.classList.remove(filterButtonOpenClass)
        element.active = false
      })

      Array.from(filterSections).forEach(element => {
        element.classList.add(mojHiddenClass)
      })
    }

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

    var clearTags = document.getElementsByClassName(
      'moj-filter__tag pac-filter__tag'
    )
    Array.prototype.forEach.call(clearTags, function (element) {
      element.addEventListener('click', clearFilter)
    })
  }

  function configureCheckboxes () {
    function checkboxClick (e) {
      e.stopPropagation()
      var button = document.getElementById(
        'button-' + e.target.name.substring(e.target.name.indexOf('-') + 1)
      )
      var anySelected = false
      var checkboxesInGroup = document.querySelectorAll(
        '[id^="checkbox-' + e.target.name + '"]'
      )
      Array.prototype.forEach.call(checkboxesInGroup, function (element) {
        anySelected = anySelected || element.checked
      })
      anySelected
        ? button.classList.add('pac-filter-button--selected')
        : button.classList.remove('pac-filter-button--selected')
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
