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
  const hiddenInputs = [...(templateValues.params.sorts || [])]

  if (templateValues.params.includeDefendantSort && !hiddenInputs.find(input => input.id === 'defendantName')) {
    hiddenInputs.push({ id: 'defendantName', value: 'NONE' })
  }

  if (templateValues.params.includeProbationStatusSort && !hiddenInputs.find(input => input.id === 'probationStatus')) {
    hiddenInputs.push({ id: 'probationStatus', value: 'NONE' })
  }

  filterTemplateValues.params.hiddenInputs = hiddenInputs

  const componentHtml = nunjucks.render(templatePath, filterTemplateValues)

  return { html: componentHtml, javascript: `/javascripts/filter-component-${config.appVersion}.min.js` }
}

module.exports = { populateTemplateValuesWithComponent, getFilterComponent }
