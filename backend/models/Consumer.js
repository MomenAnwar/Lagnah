const mongoose = require('mongoose')

const consumerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    partenerName: {
        type: String,
        required: true
    },
    IDNumber: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String
    },
    childrenCount: {
        type: Number,
        required: true
    },
    income: {
        type: Number,
    },
    age: {
        type: Number
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    financeConsumed: {
        type: Number,
        default: 0
    },
    seedsConsumed: {
        type: Number,
        default: 0
    },
    meatsConsumed: {
        type: Number,
        default: 0
    },
    teretory: {
        type: String
    }
}, {
    timestamps: true
})

const Consumer = mongoose.model('Consumer', consumerSchema)
module.exports = Consumer