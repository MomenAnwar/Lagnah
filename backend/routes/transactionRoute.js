const express = require('express')
const { getAllTransactions, 
        addTransaction, 
        getSingleTransaction } = require('../controllers/transactionController')

const { protectAdminRoute } = require('../middlewares/protectRoute')


const Router = express.Router()


Router.route('/').get(protectAdminRoute, getAllTransactions)
                .post(protectAdminRoute, addTransaction)


Router.route('/:transactionId').get(protectAdminRoute, getSingleTransaction)

module.exports = Router