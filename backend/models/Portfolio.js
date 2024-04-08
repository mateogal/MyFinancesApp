const mongoose = require('mongoose')

const PortfolioSchema = new mongoose.Schema({
   symbol:{
      'type': String,
      required: true,
      unique: true,
      trim:true
   },
   quantity:{
      type: Number,
      required: true,
      trim: true
   },
   avgPrice:{
      type: Number,
      required: true,
      trim: true
   },
   totalFiat:{
      type: Number,
      required: true,
      trim: true
   }
})

module.exports = mongoose.model('Portfolio', PortfolioSchema)