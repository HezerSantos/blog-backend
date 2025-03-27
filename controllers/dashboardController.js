const { validateBlog } = require("../validation/blogValidator")
const { validationResult } = require("express-validator")
const prisma = require("../config/prisma")
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const sharp = require('sharp')
exports.getDashboard = (req, res) => {
    res.json({
        user: {
            username: req.user.username,
            id: req.user.id
        }
    })
}

const getDate = () => {
    let currentDate = new Date();

    // Extract month, day, and year
    let month = currentDate.getMonth() + 1;  // Months are zero-indexed, so add 1
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();

    // Format to MM-DD-YYYY
    let formattedDate = `${month}-${day}-${year}`;

    return formattedDate;
}
exports.postBlog = [
    validateBlog,
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const image = req.file
        const { title, synopsis, text } = req.body
        try{
            if (image){
                const optimizedImage = await sharp(image.buffer)
                    .resize(800)
                    .webp({ quality: 80})
                    .toBuffer();

                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from("images")
                    .upload(`${req.user.id}/${image.originalname}`, optimizedImage, {
                        cacheControl: '3600',
                        upsert: false
                    })
                if (uploadError){
                    console.error("upload Error:", uploadError)
                    throw new Error()
                }
            }

            const {id} = await prisma.blog.create({
                data: {
                    title: title,
                    postDate: getDate(),
                    synopsis: synopsis,
                    userId: req.user.id
                }
            })
            await prisma.passage.create({
                data: {
                    text: text,
                    blogId: id
                }
            })

            if(image) {
                const { data: imageUrl } = await supabase
                .storage
                .from("images")
                .getPublicUrl(`${req.user.id}/${image.originalname}`)
                
                await prisma.image.create({
                    data: {
                        url: image? imageUrl.publicUrl : "",
                        blogId: id
                    }
                })
            }
            console.log("File Upload Success")
            return res.json({
                message: "Data received"
            })
        } catch(e) {
            console.error(e)
            return res.status(400).json({
                message: "error receiving data"
            })
        }
    }
]

exports.getUserBlogs = async(req, res) => {
    try{
        const blogs = await prisma.blog.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                image: true,
                passage: true
            }
        })
        return res.json({
            blogs: blogs
        })
    } catch(e) {
        return res.status(400).json({
            errors: "error fetching blogs"
        })
    }

    
}
