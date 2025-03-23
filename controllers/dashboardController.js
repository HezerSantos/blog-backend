exports.getDashboard = (req, res) => {
    res.json({
        user: {
            username: req.user.username
        }
    })
}

exports.postBlog = (req, res) => {
    const image = req.file
    console.log(image)
    console.log(req.body)

    res.json({
        message: "Data received"
    })
}