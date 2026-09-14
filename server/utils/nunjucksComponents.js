const nunjucks = require('nunjucks')
const nodePath = require('path')
const config = require('../../server/config')

const populateTemplateValuesWithComponent = (templateValues, componentName, component) => {
  if (!templateValues.components) {
    templateValues.components = {}
  }

  templateValues.components[componentName] = component
  return templateValues
}

const getFilterComponent = (templateValues) => {
  const templatePath = nodePath.join(__dirname, '../../server/views/components/filter/') + 'template.njk'
  const filterTemplateValues = { ...templateValues }
  let hiddenInputs

  if (templateValues.params.sorts) {
    // Outcomes pages: always emit all three sort inputs so filter submissions preserve whichever sort is active
    const activeSorts = templateValues.params.sorts
    const sortIds = ['hearingDate']
    if (templateValues.params.includeDefendantSort) sortIds.push('defendantName')
    if (templateValues.params.includeProbationStatusSort) sortIds.push('probationStatus')

    hiddenInputs = sortIds.map(id => {
      const active = activeSorts.find(s => s.id === id)
      return { id, value: active ? active.value : 'NONE' }
    })
  } else {
    // Non-outcomes pages: don't add sort inputs
    hiddenInputs = []
  }

  filterTemplateValues.params.hiddenInputs = hiddenInputs

  const componentHtml = nunjucks.render(templatePath, filterTemplateValues)

  return { html: componentHtml, javascript: `/javascripts/filter-component-${config.appVersion}.min.js` }
}

module.exports = { populateTemplateValuesWithComponent, getFilterComponent }
