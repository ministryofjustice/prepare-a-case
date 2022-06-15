module.exports = {
  courtRoomDisplay: (sourceString) => {
    return sourceString.includes('Courtroom') ? sourceString.replace(/([A-Za-z 0]*)?/, '') : sourceString.replace(/([0]*)?/, '')
  },
  ordinalNumber: (number) => {
    if (!Number.isInteger(number)) return 'Not available'
    const ordinal = ['st', 'nd', 'rd'][((number + 90) % 100 - 10) % 10 - 1] || 'th'
    return number + ordinal
  }
}
