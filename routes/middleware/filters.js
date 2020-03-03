const filters = (req, res, next) => {
  // Configure the available filters
  const caseListFilters = [{
    id: 'probationStatus',
    label: 'Probation status',
    items: [{
      label: 'Current',
      value: 'Current'
    }, {
      label: 'Previously known',
      value: 'Previously known'
    }, {
      label: 'No record',
      value: 'No record'
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

  // Get selected filters from session
  const selectedFilters = req.session.selectedFilters

  /* @TODO: Get the courtroom numbers/names for the given court, Sheffield has 8 */
  for (let step = 1; step <= 8; step++) {
    caseListFilters[1].items.push({ label: step.toString(), value: step.toString() })
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
  caseListFilters.forEach(item => {
    item.items.forEach(obj => {
      Object.keys(obj).forEach(() => {
        if (selectedFilters && selectedFilters[item.id]) {
          selectedFilters[item.id].forEach(selection => {
            obj.checked = obj.checked || obj.value === selection
          })
        }
      })
    })
  })

  req.params.filters = caseListFilters
  next()
}

module.exports = {
  filters
}
