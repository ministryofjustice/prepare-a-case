const moment = require('moment')
module.exports = {
  json: function (value) {
    return value ? JSON.parse(value) : ''
  },

  limit: (arr, limit) => {
    return arr ? arr.slice(0, limit) : []
  },

  properCase: (name) => {
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
  },

  removeTitle: (name) => {
    const pattern = /\b(?:Mr *|Miss *|Mrs *|Ms *|Dr *|01 )\b/i
    return name ? name.replace(pattern, '') : ''
  },

  markMatches: (matchString, sourceString) => {
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
  },

  emptyIfUnmarked: (matchString) => {
    return matchString.includes('<mark>') ? matchString : ''
  },

  apostropheInName: (name) => {
    const pattern = /\b(&#39;)\b/g
    return name.replace(pattern, '\'')
  },

  unique: arr => [...new Set(arr)],

  courtRoomDisplay: (sourceString) => {
    return sourceString.includes('Courtroom') ? sourceString.replace(/([A-Za-z 0]*)?/, '') : sourceString.replace(/([0]*)?/, '')
  },

  ordinalNumber: (number) => {
    if (!Number.isInteger(number)) return 'Not available'
    const ordinal = ['st', 'nd', 'rd'][((number + 90) % 100 - 10) % 10 - 1] || 'th'
    return number + ordinal
  },

  caseCommentTimeFormat: (dateString) => {
    if (!dateString) {
      return 'Not available'
    }
    return moment(dateString).format('D MMMM YYYY, HH:mm')
  },

  doubleQuote: (string) => {
    if (!string) {
      string = ''
    }
    return `&ldquo;${string}&rdquo;`
  },

  hearingNoteTimeFormat: (dateString) => {
    if (!dateString) {
      return ''
    }
  }

}
