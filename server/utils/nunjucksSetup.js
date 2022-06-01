const nunjucks = require('nunjucks')
const { googleAnalyticsKey } = require('../../config')

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
    return value ? JSON.parse(value) : ''
  })

  env.addFilter('limit', (arr, limit) => {
    return arr ? arr.slice(0, limit) : []
  })

  env.addFilter('properCase', (name) => {
    if (!name) {
      return ''
    }
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
    return name ? name.replace(pattern, '') : ''
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

  env.addFilter('emptyIfUnmarked', (matchString) => {
    return matchString.includes("<mark>") ? matchString : '';
  })

  env.addFilter('apostropheInName', (name) => {
    const pattern = /\b(&#39;)\b/g
    return name.replace(pattern, '\'')
  })

  env.addFilter('ordinalNumber', (number) => {
    const ordinal = ['st', 'nd', 'rd'][((number + 90) % 100 - 10) % 10 - 1] || 'th'
    return number + ordinal
  })

  env.addFilter('courtRoomDisplay', (sourceString) => {
    return sourceString.includes('Courtroom') ? sourceString.replace(/([A-Za-z 0]*)?/, '') : sourceString.replace(/([0]*)?/, '')
  })

  env.addFilter('unique', arr => [...new Set(arr)])

  env.addGlobal('googleAnalyticsKey', googleAnalyticsKey)
}
