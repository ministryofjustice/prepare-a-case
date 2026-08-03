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
  const activeSorts = templateValues.params.sorts || []

  // Always emit all three sort inputs so filter form submissions preserve whichever sort is active
  const sortIds = ['hearingDate']
  if (templateValues.params.includeDefendantSort) sortIds.push('defendantName')
  if (templateValues.params.includeProbationStatusSort) sortIds.push('probationStatus')

  const hiddenInputs = sortIds.map(id => {
    const active = activeSorts.find(s => s.id === id)
    return { id, value: active ? active.value : 'NONE' }
  })

  filterTemplateValues.params.hiddenInputs = hiddenInputs

  const componentHtml = nunjucks.render(templatePath, filterTemplateValues)

  return { html: componentHtml, javascript: `/javascripts/filter-component-${config.appVersion}.min.js` }
}

module.exports = { populateTemplateValuesWithComponent, getFilterComponent }
