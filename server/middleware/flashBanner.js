module.exports = async app => app.use((req, res, next) => {
  req.flash = (name, value) => {
    if (!this.session.flashMessages) {
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
  next();
})