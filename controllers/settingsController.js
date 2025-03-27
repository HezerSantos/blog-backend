const bcrypt = require("bcryptjs");
const { validateCredentials } = require("../validation/updateValidator");
const { validationResult } = require("express-validator");
const prisma = require("../config/prisma")
exports.updateProfile = [
    validateCredentials,
    async(req, res) => {
        try{
            console.log("request received")
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
            const { username, password, verify} = req.body

            const proceed = await bcrypt.compare(verify, req.user.password)
            if(!proceed){
                return res.status(401).json({
                    errors: [{type: 'field', value: verify, msg: 'Unauthorized', path: 'verify', location: 'body'}]
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            
            const updateData = {}

            if (username){
                updateData.username = username
            }

            if (password){
                updateData.password = hashedPassword
            }

            const updateUser = await prisma.user.update({
                where: {
                    id: req.user.id
                },
                data: updateData
            })

            res.json({
                message: "success",
                update: updateUser
            })
        } catch(e){
            return res.status(401).json("Unauthorized")
        }
    }
]