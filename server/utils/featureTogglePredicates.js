const { settings } = require('../../config')

const normaliseListValues = list => list?.map(value => value?.toLowerCase()) || []

const enabledForCourts = (...courtList) => {
  const normalisedCourtsList = normaliseListValues(courtList)
  return {
    isEnabled: (context) => {
      return !!context && normalisedCourtsList.includes(context.court?.toLowerCase())
    }
  }
}

const enabledForUsers = (...userList) => {
  const normalisedUserNames = normaliseListValues(userList)
  return {
    isEnabled: (context) => {
      return !!context && normalisedUserNames.includes(context.username?.toLowerCase())
    }
  }
}

const isEnv = (...envs) => {
  const normalizedEnvs = normaliseListValues(envs)
  return {
    isEnabled: () => {
      return !!normalizedEnvs.find(env => env === settings.pacEnvironment?.toLowerCase())
    }
  }
}

const mainFeatureToggleEnabled = feature => ({
  isEnabled: () => {
    return !!feature && !!settings[feature]
  }
})

const enabledForSourceTypes = (...sourceTypes) => (
  {
    isEnabled: (context) => {
      return !!context && !!context.sourceType && sourceTypes?.includes(context.sourceType)
    }
  }
)

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
  enabledForSourceTypes,
  disabledForAll,
  allOf,
  anyOf,
  isEnv
}
