exports.signupUser = async(req, res, next) => {
    console.log(req.body)

    res.json({
        message: "hello"
    })
}