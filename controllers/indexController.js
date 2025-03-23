const prisma = require("../config/prisma")

exports.getIndex = (req, res, next) => {
    // console.log(req.user)

    res.json({
        message: "Refreshed Login"
    })
}

exports.getBlogs = async(req, res) => {
    try{
        const blogs = await prisma.blog.findMany({
            include: {
                image: true,
                passage: true
            }
        })

        res.json({
            blogs: blogs
        })
    } catch(e) {
        console.error(e)
        return res.status(400).json({
            errors: "error getting blogs"
        })
    }
}