const mongoose = require('mongoose')

const financeSchema = new mongoose.Schema({
    totalFinance: {
        type: Number,
    },
    seeds: [{
        type:{
            type: String,
        },
        amount: {
            type: Number,
            default: 0
        }
    }],
    recentTargets: [{
        type: String
    }],
    recentSources: [{
        type: String
    }]
}, {
    timestamps: true
})


const Finance = mongoose.model('Finance', financeSchema)
module.exports = Finance