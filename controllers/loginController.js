const { passport, authenticateUser } = require("../config/passport")


exports.loginUser = async(req, res, next) => {
    try {
        const { username, password} = req.body

        const { user, token } = await authenticateUser(username, password)

        res.cookie("token", token, {
            httpOnly: true,      // Prevents access to the cookie from JavaScript
            secure: true, // Use HTTPS in production
            maxAge: 60 * 60 * 1000, // 1 hour expiration time (can adjust as needed)
            sameSite: "None", // To mitigate CSRF attacks
            path: "/",
        });

        return res.json({user})
    } catch(e) {
        return res.status(401).json({error: "Incorrect username or password"})
    }
}