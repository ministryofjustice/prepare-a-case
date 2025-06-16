const moment = require('moment')

/**
 * Based on the format "{number, period, delta}", will replace the slug with
 * the time from today using the provided format
 * @param {*} input The input to parse
 * @param {*} dateFormat The format to use on the resultant data
 * @returns The orignal input if a match is found, else will replace the slug with the caluclated date
 */
const parseCypressDate = (input, dateFormat) => {
  if (!input.match('.*{.+}')) {
    return input
  } else {
    const timeString = input.substring(input.indexOf('{') + 1, input.indexOf('}'))
    const timeParts = timeString.split(' ')
    const number = timeParts[0]
    const period = timeParts[1]
    const delta = timeParts[2]
    let moddedTime = moment()
    // Expand these options as required
    switch (delta) {
      case 'ago':
        moddedTime = moddedTime.add((-1 * number), period)
        break
      case 'ahead':
        moddedTime = moddedTime.add(number, period)
        break
    }
    const result = input.slice(0, input.indexOf('{')) + moddedTime.format(dateFormat)
    return result
  }
}

module.exports = {
  parseCypressDate
}
