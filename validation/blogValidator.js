const { body } = require("express-validator")

exports.validateBlog = [
    body("title")
        .isLength({max: 30}).withMessage("Title can have a max of 30 characters")
        .trim()
        .escape(),
    body("synopsis")
        .isLength({max: 610}).withMessage("Synopsis can have a max of 610 characyers")
        .trim()
        .escape(),
    body("text")
        .trim()
        .escape(),
    body()
        .custom(async(file, {req }) => {
            const allowedTypes = new Set([
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/bmp",
                "image/webp",
                "image/svg+xml",
                "image/tiff",
                "image/x-icon",
                "image/heif",
                "image/heic",
                "image/apng",
                "image/jp2",
                "image/avif",
                "image/fractal"
            ])
            if(req.file){
                if (!allowedTypes.has(req.file.mimetype)){
                    console.log(req.file.mimetype)
                    throw new Error("Invalid image type")
                }
                return true
            }
        })
]