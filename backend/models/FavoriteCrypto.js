import mongoose from 'mongoose'

const FavoriteCryptoSchema = new mongoose.Schema({
    symbol:{
        'type': String,
        required: [true, 'must provide symbol'],
        trim: true,
        unique: true
    },

})

module.exports = mongoose.model('FavoriteCrypto', FavoriteCryptoSchema)