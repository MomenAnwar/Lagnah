const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    isFinance: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        enum: ['incoming', 'outgoing'],
        required: true
    },
    depositeSource: {
        type: String
    },
    targetDescription: {
        type: String
    },
    seedsType: {
        type: String
    },
    consumers: [{
        consumer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Consumer',
        },
        consumerShare: {
            type: Number
        }
    }], 
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction