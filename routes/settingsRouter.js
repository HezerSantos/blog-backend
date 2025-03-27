const { Router } = require("express")
const { passport } = require("../config/passport")
const { updateProfile } = require("../controllers/settingsController")
const settingsRouter = Router()

settingsRouter.put("/update-profile", passport.authenticate("jwt", {session: false}), updateProfile)

module.exports = settingsRouter