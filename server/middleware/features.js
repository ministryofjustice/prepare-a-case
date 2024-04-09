const roles = require('../../config/features.json')

// loads features available for the users roles

module.exports = async app => app.use((req, res, next) => {
  const user = res.locals?.user
  if (user) {
    const { roles:myRoles } = user
    // dedup
    res.locals.user.features = new Map(myRoles
      // ignore any roles we're not interested in
      .filter(myRoleId => roles[myRoleId])
      // flatten feature ids
      .reduce((myRoleId, features) => {
        features
          .push(roles[myRoleId].features)
        return features
      }, [])
    )
  }

  return next()
})