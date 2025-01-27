const User = require("../models/User")
const { verifyToken } = require("./tokens")


const protectRoute = async (req, res, next) => {
    try {
        const encoded = verifyToken(req.cookies.user)
        const user = await User.findById(encoded.id)
        if(!user || !encoded){
            return res.status(400).json({success: false, data: 'يرجى تسجيل الدخول أولا!'})
        }
        req.user = user._id
        next()
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

const protectManagerRoute = async (req, res, next) => {
    try {
        const encoded = verifyToken(req.cookies.user)
        const user = await User.findById(encoded.id).select('-password -adminPassword')
        if(!user || !encoded || !user.isAdmin || !user.isManager){
            return res.status(400).json({success: false, data: 'غير مصرح!'})
        }
        req.user = user._id 
        next()
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const protectAdminRoute = async (req, res, next) => {
    try {
        const encoded = verifyToken(req.cookies.user)
        const user = await User.findById(encoded.id).select('-password -adminPassword')
        if(!user || !encoded || !user.isAdmin){
            return res.status(400).json({success: false, data: 'غير مصرح!'})
        }
        req.user = user._id 
        next()
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

module.exports = {
    protectAdminRoute,
    protectRoute,
    protectManagerRoute
}