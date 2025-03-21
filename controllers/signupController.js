const { validationResult } = require("express-validator")
const { validateSignup } = require("../validation/signupValidator")

const bcrypt = require("bcryptjs")
const prisma = require("../config/prisma")
exports.signupUser = [
    validateSignup,
    async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            const { username, password } = req.body
        
            const hashedPassword = await bcrypt.hash(password, 10)
    
            await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword
                }
            })
        } catch (e) {
            console.error(e)
            return res.status(500).json({
                errors: {path: "network", msg: "Network Error"}
            })
        }
        // console.log(username, hashedPassword)
        res.json({
            message: "Successfully Signed Up User"
        })
    }
]