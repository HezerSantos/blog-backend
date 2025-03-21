const { Router } = require("express")
const { passport } = require("../config/passport")
const { getDashboard } = require("../controllers/dashboardController")
const dashboardRouter = Router()

dashboardRouter.get("/", passport.authenticate("jwt", {session: false}), getDashboard)

module.exports = dashboardRouter