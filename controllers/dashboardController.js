exports.getDashboard = (req, res) => {
    res.json({
        user: {
            username: req.user.username
        }
    })
}