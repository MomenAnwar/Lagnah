const express = require('express')
const { protectManagerRoute, protectRoute } = require('../middlewares/protectRoute')
const { getAllMessages, readMessage, getSingleMessage, sendMessage } = require('../controllers/messageController')

const Router = express.Router()


Router.route('/:id').get(protectManagerRoute, getSingleMessage)
                    .put(protectManagerRoute, readMessage)


Router.route('/').get(protectManagerRoute, getAllMessages)
                .post(protectRoute, sendMessage)


module.exports = Router