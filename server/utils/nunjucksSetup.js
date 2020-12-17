const nunjucks = require('nunjucks')

module.exports = (app, path) => {
  const env = nunjucks.configure([
    path.join(__dirname, '../../node_modules/govuk-frontend/'),
    path.join(__dirname, '../../node_modules/@ministryofjustice/frontend/'),
    path.join(__dirname, '../../server/views')
  ], {
    autoescape: true,
    express: app,
    watch: process.env.WATCH_TEMPLATES
  })

  env.addFilter('json', function (value) {
    return JSON.parse(value)
  })

  env.addFilter('limit', (arr, limit) => {
    return arr.slice(0, limit)
  })

  env.addFilter('properCase', (name) => {
    return (name.replace(/[^\s\-']+[\s\-']*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    }).replace(/\b(Van|De|Der|Da|Von)\b/g, (nobiliaryParticle) => {
      return nobiliaryParticle.toLowerCase()
    }).replace(/Mc(.)/g, (match, letter3) => {
      return `Mc${letter3.toUpperCase()}`
    }))
  })

  env.addFilter('removeTitle', (name) => {
    const pattern = /\b(?:Mr *|Miss *|Mrs *|Ms *|Dr *|01 )\b/i
    return name.replace(pattern, '')
  })

  env.addFilter('markMatches', (matchString, sourceString) => {
    const sourceSplit = sourceString.split(' ').map(item => {
      return item.replace(',', '').toLowerCase()
    })
    const filteredArr = matchString.split(' ').map(item => {
      let hasComma = false
      if (item.indexOf(',') !== -1) {
        item = item.replace(',', '')
        hasComma = true
      }
      return (sourceSplit.includes(item.toLowerCase()) ? `<mark>${item}</mark>` : item) + (hasComma ? ',' : '')
    })
    return filteredArr.join(' ')
  })
}
