const Consumer = require("../models/Consumer")
const { validateConsumer } = require("../utils/joi")


const addConsumer = async (req, res) => {
    try {
        const {error} = validateConsumer(req.body)
        if(error){
            return res.status(400).json({success: false, data: error.details[0].message})
        }

        const consumer = await Consumer.findOne({IDNumber: req.body.IDNumber})
        if(consumer){
            return res.status(401).json({success: false, data: 'تم تسجيل هذا الرقم القومى من قبل!'})
        }
        
        const newConsumer = new Consumer(req.body)
        await newConsumer.save()
        res.status(200).json({success: true, data: 'تم إضافة المستفيد بنجاح.'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

const editConsumer = async (req, res) => {
    try {
        const {consumerId} = req.params
        const {error} = validateConsumer(req.body)
        if(error){
            return res.status(400).json({success: false, data: error})
        }
        const consumer = await Consumer.findById(consumerId)
        if(!consumer){
            return res.status(401).json({success: false, data: 'تعذر العثور على المستفيد, من فضلك أعد المحاولة!'})
        }
        const editedConsumer = await Consumer.findByIdAndUpdate(consumerId, {
            $set: {
                ...req.body
            }
        })
        res.status(201).json({success: true, data: 'تم تحديث بيانات المستفيد.'})
    } catch (error) {
        res.status(400).json({success: false, data: error.message[0].details})
    }
}

const getAllConsumers = async (req, res) => {
    try {
        const consumers = await Consumer.find().populate('transactions')
        if(!consumers){
            return res.status(400).json({success: false, data: 'حدث خطأ ما, برجاء إعادة المحاولة!'})
        }
        res.status(200).json({success: true, data: consumers})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

const getConsumerById = async (req, res) => {
    try {
        const consumer = await Consumer.findById(req.params.consumerId).populate('transactions')
        if(!consumer){
            return res.status(400).json({success: false, data: 'تعذر العثور على المستفيد, برجاء إعادة المحاولة!'})
        }
        res.status(200).json({success: true, data: consumer})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

const deleteConsumer = async (req, res) => {
    try {
        const {consumerId} = req.params
        const consumer = await Consumer.findById(consumerId)
        if(!consumer){
            return res.status(400).json({success: false, data: 'تعذر العثور على المستفيد, برجاء إعادة المحاولة!'})
        }
        await Consumer.findByIdAndDelete(consumerId)
        res.status(200).json({success: true, data: 'تم حذف المستفيد بنجاح.'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

module.exports = {
    addConsumer,
    editConsumer,
    getAllConsumers,
    getConsumerById,
    deleteConsumer
}