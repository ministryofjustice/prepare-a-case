module.exports = (cases) => {
  if (!cases || !cases.length) {
    return undefined
  }

  const items = [...new Set(cases.map(c => JSON.stringify({ label: c.assignedTo, value: c.assignedToUuid })))]
    .map(jsonString => JSON.parse(jsonString))
    .sort((a, b) => {
      const textA = a.label.toUpperCase()
      const textB = b.label.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  return { id: 'assignedTo', label: 'Assigned to', items }
}
