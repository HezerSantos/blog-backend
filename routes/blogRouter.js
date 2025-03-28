const { Router } = require("express")
const { getBlogs, getBlogById, editBlogById, updateBlogById, deleteBlog } = require("../controllers/blogController")
const { passport } = require("../config/passport")
const blogRouter = Router()
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


blogRouter.get("/", getBlogs)

blogRouter.get("/:id", getBlogById)

blogRouter.get("/:blogId/users/:userId/edit", passport.authenticate("jwt", {session: false}), editBlogById)

blogRouter.put("/:blogId/users/:userId/update", passport.authenticate("jwt", {session: false}), upload.single('file'), updateBlogById)

blogRouter.delete("/:blogId", passport.authenticate("jwt", {session: false}), deleteBlog)
module.exports =  blogRouter