const Consumer = require("../models/Consumer")
const Finance = require("../models/Finance")
const Transaction = require("../models/Transaction")
const { validateTransaction } = require("../utils/joi")
const cloudinary = require("../libs/cloudinary");


const addTransaction = async (req, res) => {
    try {        
        const {error} = validateTransaction(req.body)
        if(error){
            return res.status(400).json({success: false, data: error.details[0].message})
        }
        let cloudinaryResponse = null
        
        const { amount, seedsType, type, consumers, targetDescription, depositeSource, isFinance, images, isSeeds } = req.body
        const reqAmount = parseInt(amount)

        const newTransaction = new Transaction(req.body)
        const finance = await Finance.findById('674a370db19dbef4ac77e7e0')        
        
        async function handleConsumer (id, consumerShare){
            const consumer = await Consumer.findOne({IDNumber: id})            
            
            if(!consumer){
                return res.status(404).json({success: false, data: 'لم يتم العثور على هذا المستفيد!'})
            }

            if(!consumer.transactions){
                consumer.transactions = []
            }
            consumer.transactions.unshift(newTransaction._id)

            if(isFinance){
                consumer.financeConsumed += parseInt(consumerShare)
            } else {
                if ( isSeeds){
                    consumer.seedsConsumed += parseInt(consumerShare)
                }else {
                    consumer.meatsConsumed += parseInt(consumerShare)
                }
            }

            if(!newTransaction.consumers){
                newTransaction.consumers = []
            }
            newTransaction.consumers.unshift({consumer: consumer._id, consumerShare})            

            await consumer.save()
        }

        
        
        if(type === 'outgoing'){  //outgoing transactions
            
            
            if(finance.totalFinance < reqAmount){
                return res.status(400).json({success: false, data: 'لا يوجد مبلغ كافى لإتمام العملية!'})
            }

            if(!consumers){
                return res.status(400).json({success: false, data: 'برجاء تحديد المستفيدين من العملية!'})
            }

            
            
            const sharedAmount = consumers.reduce( (acc, current ) => {
                return acc += parseInt(current.share)
            }, 0)
            

            if(sharedAmount !== reqAmount){
                return res.status(400).json({success: false, data: 'برجاء توزيع الحصص على المستفيدين بشكل صحيح!'})
            }            

            for (const { id, share } of consumers) {
                await handleConsumer(id, share);
            }

            if(isFinance){
                finance.totalFinance -= reqAmount
            } else {

                if (isSeeds === true){
                    if(!finance.seeds){
                        return res.status(400).json({success: false, data: 'لا يوجد محاصيل بالخزنة!'})
                    }
    
                    let seed = finance.seeds.find(seed => seed.type === seedsType)
    
                    if(!seed){
                        return res.status(404).json({success: false, data: 'نوع المحصول غير موجود، برجاء اختيار نوع آخر!'})
                    } else {
                        if(seed.amount < reqAmount){
                            return res.status(400).json({success: false, data: 'لا يوجد كمية كافية من هذا المحصول لإتمام العملية!'})
                        }
    
                        seed.amount -= reqAmount
                    }
                } else {
                    finance.meats -= reqAmount
                }

            }

            if(!finance.recentTargets){
                finance.recentTargets = []
            }

            const checktarget = finance.recentTargets.find(target => target === targetDescription)
            if(!checktarget){
                finance.recentTargets.unshift(targetDescription)
            }
        } 
        else {    //incoming transactions
            
            if(!depositeSource){
                return res.status(400).json({success: false, data: 'برجاء تحديد مصدر دخل هذه العملية!'})
            }

            if(!finance.recentSources){
                finance.recentSources = []
            }

            const checkSource = finance.recentSources.find(target => target === depositeSource)
            if(!checkSource){
                finance.recentSources.unshift(depositeSource)
            }
            


            if(isFinance === true){
                finance.totalFinance += reqAmount
            } else {
                if(isSeeds === true){
                    let seed = finance.seeds.find(seed => seed.type === seedsType)
    
                    if(!seed){
                        finance.seeds.unshift({type: seedsType, amount: reqAmount})
                    } else {
                        seed.amount += reqAmount
                    }
                } else {
                    finance.meats += reqAmount
                }
                }
        }        

        if(images) {
                    cloudinaryResponse = images.map(async (img) => {
                        const res=  await cloudinary.uploader.upload(img, { folder: "transactions" })
                        return {public_id: res?.public_id,
                                url: res?.secure_url}
                    })
                }
                
        newTransaction.images = cloudinaryResponse ? await Promise.all(cloudinaryResponse) : []
        


        await Promise.all([newTransaction.save(), finance.save()]) 

        res.status(200).json({success: true, data: "تم تنفيذ التحويل بنجاح.", newFinance: finance})

    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}





// const editTransaction = async (req, res) => {

// }



const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('consumers.consumer')
        if(!transactions){
            return res.status(404).json({success: false, data: 'حدث خطأ ما, برجاء المحاولة لاحقا!'})
        }
    res.status(200).json({success: true, data: transactions.reverse()})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}



const getSingleTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId).populate({
            path: 'consumers',
            populate: {
                path: 'consumer',
                model: 'Consumer'
            }
        })

        if(!transaction){
            return res.status(404).json({success: false, data: 'لم يتم العثور على هذه الحوالة!'})
        }
        res.status(200).json({success: true, data: transaction})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}



module.exports = {
    addTransaction,
    getAllTransactions,
    getSingleTransaction,
}