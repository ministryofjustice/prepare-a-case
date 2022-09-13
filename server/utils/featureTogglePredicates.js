const { settings } = require('../../config')
const enabledForCourts = (...courtList) => {
  return {
    isEnabled: (context) => {
      return !!context && courtList?.includes(context.court)
    }
  }
}

const enabledForUsers = (...userList) => {
  return {
    isEnabled: (context) => {
      return !!context && userList?.includes(context.username)
    }
  }
}

const mainFeatureToggleEnabled = feature => ({
  isEnabled: () => {
    return !!feature && !!settings[feature]
  }
})

const enabledForAll = () => {
  return {
    isEnabled: () => {
      return true
    }
  }
}

const disabledForAll = () => {
  return {
    isEnabled: () => {
      return false
    }
  }
}

const allOf = (...predicates) => {
  return {
    isEnabled: (context) => !!context && !!predicates && !predicates.find(p => !p.isEnabled(context))
  }
}

const anyOf = (...predicates) => {
  return {
    isEnabled: (context) => !!context && !!predicates && !!predicates.find(p => p.isEnabled(context))
  }
}

module.exports = {
  mainFeatureToggleEnabled,
  enabledForUsers,
  enabledForCourts,
  enabledForAll,
  disabledForAll,
  allOf,
  anyOf
}
