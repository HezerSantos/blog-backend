const { Router } = require("express")
const { getBlogs, getBlogById } = require("../controllers/blogController")
const blogRouter = Router()


blogRouter.get("/", getBlogs)

blogRouter.get("/:id", getBlogById)

module.exports =  blogRouter