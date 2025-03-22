const { Router } = require("express")
const { getDashboard } = require("../controllers/dashboardController")
const { passport } = require("../config/passport")
const dashboardRouter = Router()


dashboardRouter.get("/", passport.authenticate("jwt", {session: false }),getDashboard)

module.exports = dashboardRouter