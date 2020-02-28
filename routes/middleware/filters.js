const filters = (req, res, next) => {
  // Get selected filters from session
  const selectedFilters = req.session.selectedFilters

  // Configure the available filters
  const filters = [{
    id: 'probationStatus',
    label: 'Probation status',
    items: [{
      label: 'Current'
    }, {
      label: 'Previously known'
    }, {
      label: 'No record'
    }]
  }, {
    id: 'courtRoom',
    label: 'Courtroom',
    items: []
  }, {
    id: 'session',
    label: 'Session',
    items: [{
      value: 'MORNING',
      label: 'Morning'
    }, {
      value: 'AFTERNOON',
      label: 'Afternoon'
    }]
  }]

  /* @TODO: Get the courtroom numbers/names for the given court, Sheffield has 8 */
  for (let step = 1; step <= 8; step++) {
    filters[1].items.push({ label: step.toString() })
  }

  // Ensure selected filters are type Array
  if (selectedFilters) {
    Object.keys(selectedFilters).forEach(item => {
      if (typeof selectedFilters[item] === 'string') {
        selectedFilters[item] = new Array(selectedFilters[item])
      }
    })
  }

  // Flag selected filters
  filters.forEach(item => {
    item.items.forEach(obj => {
      obj.value = obj.value || obj.label // Set value to label if undefined
      Object.keys(obj).forEach(() => {
        if (selectedFilters && selectedFilters[item.id]) {
          selectedFilters[item.id].forEach(selection => {
            obj.checked = obj.checked || obj.value === selection || obj.label === selection
          })
        }
      })
    })
  })

  req.params.filters = filters
  next()
}

module.exports = {
  filters
}
