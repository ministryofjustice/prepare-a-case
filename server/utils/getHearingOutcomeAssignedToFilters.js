const flagFilters = require('./flagFilters')

module.exports = (cases, selectedFilters) => {
  if (!cases || !cases.length) {
    return undefined
  }

  return flagFilters(selectedFilters, [...new Set(cases.map(c => JSON.stringify({ label: c.assignedTo, value: c.assignedToUuid })))]
    .map(jsonString => JSON.parse(jsonString))
    .sort((a, b) => {
      const textA = a.label.toUpperCase();
      const textB = b.label.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    }))
}