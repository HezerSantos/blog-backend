const { Router } = require("express")
const { passport } = require("../config/passport")
const { getIndex, getBlogs } = require("../controllers/indexController")
const indexRouter = Router()

indexRouter.get("/", passport.authenticate("jwt", {session: false}), getIndex)


module.exports = indexRouter