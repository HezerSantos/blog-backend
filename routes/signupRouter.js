const { Router } = require("express")
const signupRouter = Router()

const { signupUser } = require("../controllers/signupController")


signupRouter.post("/", signupUser)


module.exports = signupRouter