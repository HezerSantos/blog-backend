const { body } = require("express-validator")
const primsa = require("../config/prisma")
const prisma = require("../config/prisma")

exports.validateSignup = [
    body("username")
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
        .trim()
        .isLength({min: 12}).withMessage("Password must be at least 12 characters")
        .escape(),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password){
                throw new Error("Passwords dont match")
            }
            return true
        })
        .escape()
]