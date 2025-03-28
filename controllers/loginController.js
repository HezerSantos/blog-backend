const { validationResult } = require("express-validator");
const { passport, authenticateUser } = require("../config/passport");
const { validateLogin } = require("../validation/loginValidator");


exports.loginUser = [
    validateLogin,
    async(req, res, next) => {
        try {
            console.log("erm")
            const { username, password} = req.body
            // console.log(username, password)
            const { user, token } = await authenticateUser(username, password)

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                domain: '.vercel.app',
                maxAge: 24 * 60 * 60 * 1000
              });
              
              res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                domain: '.up.railway.app',
                maxAge: 24 * 60 * 60 * 1000
              });

            return res.json({user})
        } catch(e) {
            return res.status(401).json({error: "Incorrect username or password"})
        }
    }
]