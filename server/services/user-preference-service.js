const { request, update } = require('./utils/request')
const config = require('../config')
const apiUrl = config.apis.userPreferenceService.url

const getUserSelectedCourts = async (userId) => {
  const res = await request(`${apiUrl}/users/${userId}/preferences/courts`)
  if (res) {
    return res.status >= 400 ? { isError: true, status: res.status || 500 } : res.data
  }
  return { isError: true, status: 500 }
}

const updateSelectedCourts = async (userId, courts) => {
  return await update(`${apiUrl}/users/${userId}/preferences/courts`, { items: courts })
}

const getPreferences = async (userId, preference) => {
  const res = await request(`${apiUrl}/users/${userId}/preferences/${preference}`)
  if (res) {
    return res.status >= 400 ? { isError: true, status: res.status || 500 } : res.data
  }
  return { isError: true, status: 500 }
}

const updatePreferences = async (userId, preference, values) => {
  return await update(`${apiUrl}/users/${userId}/preferences/${preference}`, { items: values })
}

const getFilters = async (userId, filterType) => {
  const deconstructPersistentFilters = userPreferences => {
    if (!userPreferences.items) {
      return {}
    }

    const filters = {}
    let validDate
    let valid = false
    const today = new Date()

    const splitItem = item => {
      return item.split('=')
    }

    userPreferences.items.forEach(item => {
      const [key, value] = splitItem(item)

      if (key === 'validDate') {
        validDate = new Date(value)
      } else {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const currentValue = filters[key]

          if (Array.isArray(currentValue)) {
            currentValue.push(value)
          } else {
            filters[key] = [currentValue, value]
          }
        } else {
          filters[key] = value
        }
      }
    })

    if (
      validDate &&
      validDate.getDate() === today.getDate() &&
      validDate.getMonth() === today.getMonth() &&
      validDate.getFullYear() === today.getFullYear()) {
      valid = true
    }

    return [filters, valid]
  }

  const preferences = await getPreferences(userId, filterType)

  const [userPreferenceFilters, valid] = deconstructPersistentFilters(preferences)

  if (valid) {
    return userPreferenceFilters
  }

  return {}
}

const setFilters = async (userId, filterType, filters) => {
  const constructPersistentFilter = queryParams => {
    const queryArray = []

    Object.keys(queryParams).forEach(key => {
      const value = queryParams[key]
      if (Array.isArray(value)) {
        value.forEach(value => {
          queryArray.push(`${key}=${value}`)
        })
      } else {
        queryArray.push(`${key}=${value}`)
      }
    })

    // set the valid day
    queryArray.push(`validDate=${new Date()}`)

    return queryArray
  }

  const persistentFilters = constructPersistentFilter(filters)
  await updatePreferences(userId, filterType, persistentFilters)
}

module.exports = {
  getUserSelectedCourts,
  updateSelectedCourts,
  getPreferences,
  updatePreferences,
  getFilters,
  setFilters
}
