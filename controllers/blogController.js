const prisma = require("../config/prisma")

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

exports.getBlogById = async(req, res) => {
    const { id } = req.params

    try{
        const blog = await prisma.blog.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                image: true,
                passage: true
            }
        })

        if (!blog){
            return res.status(404).json({
                error: "Blog does not exist"
            })
        }

        return res.json({
            blog: blog
        })
    } catch(e) {
        console.error(e);
        return res.status(400).json({
            errors: "Error getting blog"
        })
    }
}