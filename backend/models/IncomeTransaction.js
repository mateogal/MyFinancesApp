const mongoose = require('mongoose')

const IncomeTransactionSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('IncomeTransaction', IncomeTransactionSchema)