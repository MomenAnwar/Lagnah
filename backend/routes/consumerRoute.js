const express = require('express')
const { addConsumer,
        getAllConsumers, 
        getConsumerById, 
        editConsumer, 
        deleteConsumer } = require('../controllers/consumerController')
const { protectAdminRoute, protectManagerRoute } = require('../middlewares/protectRoute')
const Router = express.Router()


Router.route('/').post(protectAdminRoute, addConsumer)
                .get(protectManagerRoute, getAllConsumers)

Router.route('/:consumerId').get(protectManagerRoute, getConsumerById)
                            .put(protectAdminRoute, editConsumer)
                            .delete(protectAdminRoute, deleteConsumer)

module.exports = Router