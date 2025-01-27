const cloudinary = require("../libs/cloudinary");
const Post = require("../models/Post");
const { validatePost } = require("../utils/joi");


const addPost = async (req, res) => {
    try {        
        let cloudinaryResponse = null
        const {title, content, images} = req.body
        const {error} = validatePost(req.body)
        if(error){
            return res.status(400).json({success: false, data: error.details[0].message})
        }        
        
        if(images) {
            cloudinaryResponse = images.map(async (img) => {
                const res=  await cloudinary.uploader.upload(img, { folder: "posts" })
                return {public_id: res?.public_id,
                        url: res?.secure_url}
            })
        }
        
        const newPost = new Post({title,
                                    content,
                                    images: cloudinaryResponse ? await Promise.all(cloudinaryResponse) : []})
        await newPost.save()

        res.status(200).json({success: true, data: 'تم إضافة المنشور.', body: newPost})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json({success: true, data: posts.reverse()})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({success: false, data: 'لم يتم العثور على المنشور!'})
        }
        res.status(200).json({success: true, data: post})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const editPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({success: false, data: 'لم يتم العثور على المنشور!'})
        }
        let cloudinaryResponse = null

        if (post.images) {
            post.images.map(async (img) => {
                try {
                    await cloudinary.uploader.destroy(img.public_id)
                    console.log("deleted image from cloudinary")

                } catch (error) {
                    console.log("error deleting image from cloudinary", error)
                }
            })
        }

        if(req.body.images) {
            cloudinaryResponse = req.body.images.map(async (img) => {
                const res=  await cloudinary.uploader.upload(img, { folder: "posts" })
                return {public_id: res?.public_id,
                        url: res?.secure_url}
            })
        }

        await Post.findByIdAndUpdate(req.params.id, {
            $set: {
                ...req.body,
                images: cloudinaryResponse ? await Promise.all(cloudinaryResponse) : []
            }
        })
        res.status(200).json({success: true, data: 'تم تحديث المنشور.', body: {...req.body, images: cloudinaryResponse ? await Promise.all(cloudinaryResponse) : []}})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({success: false, data: 'لم يتم العثور على المنشور!'})
        }

        if (post.images) {
            post.images.map(async (img) => {
                try {
                    await cloudinary.uploader.destroy(img.public_id)
                    console.log("deleted image from cloudinary")

                } catch (error) {
                    console.log("error deleting image from cloudinary", error)
                }
            })
        }

        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({success: true, data: 'تم حذف المنشور.'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


module.exports = {
    deletePost,
    addPost,
    editPost,
    getSinglePost,
    getAllPosts
}