const mongoose = require('mongoose')
const bankCard = require('./BankCard')

const BankSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    accountNumber: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    currency: {
        type: String,
        required: true,
        trim: true
    },
    balance: {
        type: Number,
        required: true,
        trim: true
    },
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankCard'
    }]
})

module.exports = mongoose.model('BankAccount', BankSchema)