const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    isManager: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
        },
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    adminPassword: {
        type: String,
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
module.exports = User