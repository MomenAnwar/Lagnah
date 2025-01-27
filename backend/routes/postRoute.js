const express = require('express')
const { getSinglePost, editPost, deletePost, getAllPosts, addPost } = require('../controllers/postController')
const { protectAdminRoute } = require('../middlewares/protectRoute')

const Router = express.Router()


Router.route('/:id').get(getSinglePost)
                    .put(protectAdminRoute, editPost)
                    .delete(protectAdminRoute, deletePost)

Router.route('/').get(getAllPosts).post(protectAdminRoute, addPost)


module.exports = Router