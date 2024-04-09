const queryParamBuilder = (obj) => {
  const str = []
  for (const p in obj) {
    if (Array.isArray(obj[p])) {
      obj[p].forEach(value => {
        str.push(`${encodeURIComponent(p)}=${value}`)
      })
    } else {
      str.push(`${encodeURIComponent(p)}=${obj[p]}`)
    }
  }
  return str.join('&')
}

module.exports = queryParamBuilder
