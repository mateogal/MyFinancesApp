const mongoose = require('mongoose')

const CryptoTransactionSchema = new mongoose.Schema({
   symbol:{
      'type': String,
      required: [true, 'must provide symbol'],
      trim: true,
   },
	quantity:{
		type: Number,
		required: true,
		trim: true,
	},
	cryptoPrice:{
		type: Number,
		required: true,
		trim: true,
	},   
   fiat:{
      type: String,
      required: true,
      trim: true
   },
	totalFiat:{
		type: Number,
		required: true,
		trim: true,
	},
   localFiat:{
      type: String,
      trim: true,
      default: 'N/A'
   },
   totalLocalFiat:{
      type: Number,
      trim: true,
      default: 0
   },
	date:{
		type: Date,
		required: true,
	},
   type:{
      type: String,
      required: true
   },
   location:{
      type: String,
      required: true
   },
   transactionID:{
      type: String,
      required: true,
      trim: true,
      unique: true
   },
   swapQty:{
      type: Number,
      required: false,
      trim: true,
      default: 0
   }

})

module.exports = mongoose.model('CryptoTransaction', CryptoTransactionSchema)