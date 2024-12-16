const baseRoute = '/my-courts'

const catchErrors = require('../handlers/catchAsyncErrors')
const { getUserSelectedCourts, updateSelectedCourts } = require('../../services/user-preference-service')
const userSelectedCourts = require('./handlers/userSelectedCourts').get(getUserSelectedCourts)
const courtByStateGet = require('./handlers/manageCourtByState').get(baseRoute, updateSelectedCourts)
const courtByStatePost = require('./handlers/manageCourtByState').post(baseRoute)

const registerRoutes = (router) => {
  router.get(baseRoute, catchErrors(userSelectedCourts))

  router.get(`${baseRoute}/:state`, catchErrors(courtByStateGet))

  router.post(`${baseRoute}/:state`, catchErrors(courtByStatePost))
}

module.exports = {
  registerManageCourtsRoutes: registerRoutes,
  manageCourtsRoute: baseRoute
}
