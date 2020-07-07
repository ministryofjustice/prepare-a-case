/* (now + $seconds) - 5 minutes, in millis */
module.exports = (seconds) => {
  const now = new Date()
  const secondsUntilExpiry = now.getSeconds() + (seconds - 300)
  return now.setSeconds(secondsUntilExpiry)
}
