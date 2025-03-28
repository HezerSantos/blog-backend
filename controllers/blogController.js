const prisma = require("../config/prisma")
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const sharp = require('sharp');
const { validateBlog } = require("../validation/blogValidator");
const { validationResult } = require("express-validator");
exports.getBlogs = async(req, res) => {
    try{
        const blogs = await prisma.blog.findMany({
            include: {
                image: true,
                passage: true
            }
        })
        const users = await prisma.user.findMany({
            select:{
                id: true,
                username: true
            }
        })
        // const map = new Map(users.map(item => [item.id, item.username]));
        // const usersObj = Object.fromEntries(map);
        res.json({
            blogs: blogs,
            users: users
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

exports.editBlogById = async(req, res) => {
    const { userId, blogId } = req.params
    if(parseInt(userId) !== req.user.id){
        return res.status(401).json("Unauthorized")
    }
    

    try{
        const blog = await prisma.blog.findUnique({
            where: {
                id: parseInt(blogId)
            },
            include:{
                passage: true
            }
        })
        if(!blog){
            return res.status(404).json({
                error: "Blog not Found"
            })
        }
        return res.json({
            blog: blog
        })
    } catch(e){
        console.error(e)
    }
}

exports.updateBlogById =  [
        validateBlog,
        async(req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
            const { userId, blogId } = req.params
            const { title, synopsis, text } = req.body
            const file = req.file
            if(parseInt(userId) !== req.user.id){
                return res.status(403).json("Forbidden")
            }

            const uploadData = {}
            let newUrl = null
            if (file){
                // console.log(file)
                const { image } = await prisma.blog.findUnique({
                    where:{
                        id: parseInt(blogId)
                    },
                    select: {
                        image: true
                    }
                })

                const optimizedImage = await sharp(file.buffer)
                    .resize(800)
                    .webp({ quality: 80})
                    .toBuffer();
                

                const url = image[0].url
                let imageName = url.split("/")
                imageName = imageName[imageName.length - 1]
                // console.log(imageName)

                const { data, error } = await supabase
                    .storage
                    .from("images")
                    .update(`${req.user.id}/${imageName}`, optimizedImage, {
                        cacheControl: '3600',
                        upsert: true
                    })
                
                const { data: imageUrl, error:imageError } = await supabase
                    .storage
                    .from("images")
                    .getPublicUrl(`${req.user.id}/${imageName}`)
                
                newUrl = imageUrl   
            }

            

            if (title){
                uploadData.title = title
            }
            if(synopsis){
                uploadData.synopsis = synopsis
            }
            // console.log(title, synopsis, text, file)
            try{
                const blog = await prisma.blog.update({
                    where: {
                        id: parseInt(blogId)
                    },
                    data: uploadData,
                    include:{
                        passage: true,
                        image: true

                    }
                })
                if (text) {
                    const updatedPassage = await prisma.passage.update({
                    where: {
                        id: blog.passage[0].id,
                    },
                    data: {
                        text: text,
                    },
                    });
                }
                
                if(newUrl){
                    const updatedImage = await prisma.image.update({
                        where: {
                            id: blog.image[0].id
                        },
                        data: {
                            url: newUrl.publicUrl
                        }
                    })
                }
                return res.json({
                    message: "Updated Blog"
                })
            } catch(e){
                console.error(e)
            }
        }
]

exports.deleteBlog = async(req, res) => {
    const { blogId } = req.params

    const blog = await prisma.blog.findUnique({
        where: {
            id: parseInt(blogId)
        },
        include:{
            image: true,
            passage: true
        }
    })

    const url = blog.image[0].url
    let imageName = url.split("/")
    imageName = imageName[imageName.length - 1]
    // console.log(req.user)
    if (blog.userId !== req.user.id){
        return res.status(403).json("Forbidden")
    }
    console.log("reached endpoint")
    try{
        const imageRes = await prisma.image.delete({
            where: {
                id: blog.image[0].id
            }
        })
        console.log("Deleted Image")
        const passageRes = await prisma.passage.delete({
            where: {
                id: blog.passage[0].id
            }
        })
        console.log("Deleted passage")
        const blogRes = await prisma.blog.delete({
            where: {
                id: parseInt(blogId)
            }
        })
        console.log("Deleted Blog")
        const { data, error } = await supabase
            .storage
            .from("images")
            .remove([`${req.user.id}/${imageName}`])
        console.log("Deleted Image from supabase")
        return res.json({
            message: "Deleted Blog"
        })
    } catch(e){
        console.error(e)
        return res.status(400).json({
            errors: "Error deleting data"
        })
    }
}