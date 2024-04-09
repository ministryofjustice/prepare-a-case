const passport = require('passport')

const authLogoutUrl = `${config.apis.oauth2.redirect}/logout?client_id=${config.apis.oauth2.apiClientId}&redirect_uri=${config.domain}`

module.exports = async app => {

  app.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('error', {
      status: 401,
      authURL: authLogoutUrl
    })
  })
  
  app.get('/login', passport.authenticate('oauth2'))

  app.get('/login/callback', (req, res, next) => passport.authenticate('oauth2', {
    successReturnToOrRedirect: req.session.returnTo || '/',
    failureRedirect: '/autherror'
  })(req, res, next))

  app.use('/logout', (req, res, next) => {
    if (req.user) {
      req.logout(e => {
      if (e) {
        return next(new Error(e))
      }
      })
    }
    res.redirect(authLogoutUrl)
  })
}

