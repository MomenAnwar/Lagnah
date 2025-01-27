const Finance = require("../models/Finance")


const getCurrentFinance = async (req, res) => {
    try {
        const currentFinance = await Finance.find()
        if(!currentFinance){
            return res.status(404).json({success: false, data: 'حدث خطأ، من فضلك حاول مجددا!'})
        }
        
        res.status(200).json({success: true, data: currentFinance})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

const addFirstFinance = async (req, res) => {
    try {
        const newFinance = new Finance({totalFinance: 0})
        await newFinance.save()
        
        res.status(200).json({success: true, data: newFinance})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


module.exports = { getCurrentFinance, addFirstFinance }