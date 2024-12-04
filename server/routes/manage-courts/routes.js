const baseRoute = '/my-courts'

const catchErrors = require('../handlers/catchAsyncErrors')
const { getUserSelectedCourts, updateSelectedCourts } = require('../../services/user-preference-service')
const getUserSelectedCourtsHandler = require('./handlers/getUserSelectedCourts')(getUserSelectedCourts)
const getManageCourtByStateHandler = require('./handlers/manageCourtByStateGet')(baseRoute, updateSelectedCourts)
const postManageCourtByStateHandler = require('./handlers/manageCourtByStatePost')(baseRoute)

const registerRoutes = (router) => {
  router.get(baseRoute, catchErrors(getUserSelectedCourtsHandler))

  router.get(`${baseRoute}/:state`, catchErrors(getManageCourtByStateHandler))

  router.post(`${baseRoute}/:state`, catchErrors(postManageCourtByStateHandler))
}

module.exports = {
  registerManageCourtsRoutes: registerRoutes,
  manageCourtsRoute: baseRoute
}
