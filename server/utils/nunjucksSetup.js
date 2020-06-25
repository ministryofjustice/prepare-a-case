const nunjucks = require('nunjucks')
const moment = require('moment')

module.exports = (app, path) => {
  const njkEnv = nunjucks.configure([
    path.join(__dirname, '../../node_modules/govuk-frontend/'),
    path.join(__dirname, '../../node_modules/@ministryofjustice/frontend/'),
    path.join(__dirname, '../views')
  ], {
    autoescape: true,
    express: app,
    watch: process.env.WATCH_TEMPLATES
  })

  njkEnv.addFilter('findError', (array, formFieldId) => {
    const item = array.find(error => error.href === `#${formFieldId}`)
    if (item) {
      return {
        text: item.text,
      }
    }
    return null
  })

  njkEnv.addFilter('findErrors', (errors, formFieldIds) => {
    const fieldIds = formFieldIds.map(field => `#${field}`)
    const errorIds = errors.map(error => error.href)
    const firstPresentFieldError = fieldIds.find(fieldId => errorIds.includes(fieldId))
    if (firstPresentFieldError) {
      return { text: errors.find(error => error.href === firstPresentFieldError).text }
    }
    return null
  })

  njkEnv.addFilter('hasErrorWithPrefix', (errorsArray, prefixes) => {
    const formattedPrefixes = prefixes.map(field => `#${field}`)
    return errorsArray.some(error => formattedPrefixes.some(prefix => error.href.startsWith(prefix)))
  })

  njkEnv.addFilter('formatDate', (value, format) => {
    return value ? moment(value).format(format) : null
  })

  njkEnv.addFilter('extractAttr', (array, key) => {
    return array.map(item => item[key])
  })

  njkEnv.addFilter('isArray', value => {
    return Array.isArray(value)
  })

}
