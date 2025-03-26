exports.updateProfile = async(req, res) => {
    const { username, password, verify} = req.body
    console.log(req.body)
    console.log(username, password, verify)

    res.json({
        message: "success"
    })
}