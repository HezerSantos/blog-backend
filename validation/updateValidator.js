const { body } = require("express-validator")
const prisma = require("../config/prisma")

exports.validateCredentials = [
    body("username")
        .optional({ checkFalsy: true })
        .isLength({min: 1}).withMessage("Must contain at least one character")
        .custom(async(username) => {
            let user
            try {
                user = await prisma.user.findUnique({
                    where: {
                        username: username
                    }
                })
                if (user){
                    throw new Error
                }
                return true
            } catch (e) {
                if(user){
                    throw new Error("Username Already Exists")
                } else {
                    throw new Error("Internal Server Error. Please Try Again")
                }
                
            }
        })
        .trim()
        .escape(),
    body("password")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({min: 3}).withMessage("Password must be at least 12 characters")
        .escape(),
    body("confirmPassword")
        .optional({ checkFalsy: true })
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password){
                throw new Error("Passwords dont match")
            }
            return true
        })
        .escape(),
    body("verify")
        .trim()
        .escape()
]