module.exports = function (selectedFilters, filters) {
  // Ensure selected filters are type Array
  if (selectedFilters) {
    Object.keys(selectedFilters).forEach(item => {
      if (typeof selectedFilters[item] === 'string') {
        selectedFilters[item] = new Array(selectedFilters[item])
      }
    })
  }
  const flaggedFilters = JSON.parse(JSON.stringify(filters))

  // Flag selected filters
  flaggedFilters.forEach(item => {
    item.items.forEach(obj => {
      if (obj) {
        Object.keys(obj).forEach(() => {
          if (selectedFilters && selectedFilters[item.id]) {
            selectedFilters[item.id].forEach(selection => {
              obj.checked = obj.checked || obj.value === selection
            })
          }
        })
      }
    })
  })
  return flaggedFilters
}
