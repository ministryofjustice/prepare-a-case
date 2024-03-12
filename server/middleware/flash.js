module.exports = function () {
  return (req, res, next) => {
    if (req.flash) return next()
    req.flash = flash
    next()
  }
}

function flash (name, value) {
  if (this.session === undefined) throw Error('flash requires session')

  if (this.session.flashMessages === undefined) {
    this.session.flashMessages = {}
  }

  if (name && value) {
    this.session.flashMessages[name] = value
  } else if (name) {
    const message = this.session.flashMessages[name]
    delete this.session.flashMessages[name]
    return message
  } else {
    this.session.flashMessages = {}
  }
}
