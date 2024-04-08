const mongoose = require('mongoose')

const SpentTransactionSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['Ocio', 'Necesario', 'Hobby', 'Comida', 'Regalo', 'Medico']
    },
    location: {
        type: String,
        required: false,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    from: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
        enum: ['Credito', 'Debito', 'Efectivo']
    },
})

module.exports = mongoose.model('SpentTransaction', SpentTransactionSchema)