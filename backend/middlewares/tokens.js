const jwt = require("jsonwebtoken")



const genToken = (userId, res) => {
    const token = jwt.sign({id: userId}, process.env.SECRET_KEY, {
        expiresIn: '30m'
    })
    res.cookie('user', token, {
        maxAge: 30 * 60 *1000,
        httpOnly: true,
        sameSite: "strict"
    })
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY)
}

module.exports = {
    genToken,
    verifyToken
}