const mongoose = require('mongoose')

const BankCardSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    bankAccount: {
        type: String,
        trim: true
    },
    bankName: {
        type: String,
        trim: true,
        required: true
    },
    number: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true,
        enum: ['Credito', 'Debito']
    },
    payDay: {
        type: Number,
        trim: true,
        required: true
    },
    balance: {
        type: Number,
        trim: true,
        required: true
    },
    company: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('BankCard', BankCardSchema)