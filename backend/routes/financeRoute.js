const express = require('express')
const { getCurrentFinance, addFirstFinance } = require('../controllers/financeController')

const Router = express.Router()


Router.get('/', getCurrentFinance)
Router.post('/', addFirstFinance)


module.exports = Router