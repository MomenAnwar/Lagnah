const Message = require("../models/Message")
const User = require("../models/User")
const { validateMessage } = require('../utils/joi')


const sendMessage = async (req, res) => {
    try {
        const { error } = validateMessage(req.body)
        if(error){
            return res.status(400).json({success: false, data: error})
        }
        
        const newMessage = new Message({sender: req.user, ...req.body})

        const sender = await User.findById(req.user)

        sender.messages?.unshift(newMessage._id)
        await Promise.all([newMessage.save(), sender.save()])

        res.status(200).json({success: true, data: 'تم إرسال الرسالة، شكرا لمشاركتنا رأيك.'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate('sender')
        res.status(200).json({success: true, data: messages})
    } catch (error) {
        res.status(400).json({success: false, data: error.message[0].details})
    }
}


const getSingleMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id).populate('sender')
        if(!message){
            return res.status(404).json({success: false, data: message})
        }
        res.status(200).json({success: true, data: message})
    } catch (error) {
        res.status(400).json({success: false, data: error.message[0].details})
    }
}


const readMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
        if(!message){
            return res.status(404).json({success: false, data: message})
        }
        message.isRead = true 
        await message.save()
        res.status(200).json({success: true, data: 'تم قرائة الرسالة!'})
    } catch (error) {
        res.status(400).json({success: false, data: error.message[0].details})
    }
}

module.exports = {
    getSingleMessage,
    getAllMessages,
    sendMessage,
    readMessage
}