const { Router } = require("express")
const { getDashboard, postBlog } = require("../controllers/dashboardController")
const { passport } = require("../config/passport")
const dashboardRouter = Router()
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

dashboardRouter.get("/", passport.authenticate("jwt", {session: false }),getDashboard)
dashboardRouter.post("/create-blog", 
    passport.authenticate("jwt", {session: false}), 
    upload.single('file'), 
    postBlog)
module.exports = dashboardRouter