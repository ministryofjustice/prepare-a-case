;(function setupFilterComponent () {
  'use strict'

  function resizeFilterSections () {
    const filterButtons = document.getElementsByClassName('pac-filter-button')
    const filterSections = document.getElementsByClassName(
      'pac-filter-selection'
    )
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
    const main = document.getElementsByClassName('govuk-main-wrapper')

    function toggleFilter (e) {
      e.stopPropagation()

      const isFilterButton =
        e.target.classList !== undefined &&
        Array.from(e.target.classList).includes(filterButtonClass)

      const isInsideFilterContainer = elementHasParentWithClass(
        e.target,
        filterContainerClass
      )

      if (isFilterButton) {
        e.target.active ? closeAllFilters() : openFilterMenu(e.target.id)
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
      let a = element
      const elements = []
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

      const targetButtonElement = filterButtons[targetButtonIndex]
      const targetSectionElement = filterSections[targetButtonIndex]

      targetButtonElement.classList.add(filterButtonOpenClass)
      targetButtonElement.active = true
      targetSectionElement.classList.remove(mojHiddenClass)

      filterButtonArray.splice(targetButtonIndex, 1)
      filterSectionsArray.splice(targetButtonIndex, 1)

      closeFilters(filterButtonArray, filterSectionsArray)
    }

    function closeFilters (filterButtonArray, filterSectionArray) {
      filterButtonArray.forEach(element => {
        element.classList.remove(filterButtonOpenClass)
        element.active = false
      })

      filterSectionArray.forEach(element => {
        element.classList.add(mojHiddenClass)
      })
    }

    function closeAllFilters () {
      closeFilters(Array.from(filterButtons), Array.from(filterSections))
    }

    Array.prototype.forEach.call(main, function (element) {
      element.addEventListener('click', toggleFilter)
    })
  }

  function configureClearTags () {
    function clearFilter (e) {
      e.stopPropagation()
      const checkbox = document.getElementById(e.target.dataset['controls'])
      checkbox.click()
      document.getElementById('pac-filter-form').submit()
    }

    const clearTags = document.getElementsByClassName(
      'moj-filter__tag pac-filter__tag'
    )
    Array.prototype.forEach.call(clearTags, function (element) {
      element.addEventListener('click', clearFilter)
    })
  }

  function configureCheckboxes () {
    function checkboxClick (e) {
      e.stopPropagation()
      const button = document.getElementById(
        'button-' + e.target.name.substring(e.target.name.indexOf('-') + 1)
      )
      let anySelected = false
      const checkboxesInGroup = document.querySelectorAll(
        '[id^="checkbox-' + e.target.name + '"]'
      )
      Array.prototype.forEach.call(checkboxesInGroup, function (element) {
        anySelected = anySelected || element.checked
      })
      anySelected
        ? button.classList.add('pac-filter-button--selected')
        : button.classList.remove('pac-filter-button--selected')
    }

    const checkboxes = document.getElementsByClassName('pac-filter-checkbox')
    Array.prototype.forEach.call(checkboxes, function (element) {
      element.addEventListener('click', checkboxClick)
    })
  }

  function configureResetButton () {
    function resetFilters (e) {
      e.stopPropagation()
      const form = document.getElementById('pac-filter-form')
      const checkboxes = document.getElementsByClassName('pac-filter-checkbox')
      Array.prototype.forEach.call(checkboxes, function (element) {
        if (element.checked) {
          element.click()
        }
      })
      form.submit()
    }

    const resetBtn = document.getElementById('reset-filters')
    resetBtn.addEventListener('click', resetFilters)
  }

  resizeFilterSections()
  configureFilterButtons()
  configureClearTags()
  configureCheckboxes()
  configureResetButton()
})()
