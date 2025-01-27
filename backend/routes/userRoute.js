const express = require('express')
const { signUp, getAllUsers, setAsAdmin, deleteUser, signIn, editUser, getSingleUser, toggleManager, verifySignUpEmail, sendMailToAll, sendEmail } = require('../controllers/userController')
const { protectAdminRoute, protectRoute, protectManagerRoute } = require('../middlewares/protectRoute')

const Router = express.Router()


Router.post('/register', signUp)
Router.post('/login', signIn)
Router.post('/verify', verifySignUpEmail)
Router.get('/', protectManagerRoute, getAllUsers)
Router.route('/:id').delete(protectAdminRoute, deleteUser)
                    .get(protectRoute, getSingleUser)
                    .put(protectRoute, editUser)

Router.post('/messageAll', protectManagerRoute, sendMailToAll)
Router.put('/admin/:id', protectAdminRoute, setAsAdmin)
Router.put('/manager/:id', protectAdminRoute, toggleManager)
Router.put('/sendEmail', protectAdminRoute, sendEmail)


module.exports = Router