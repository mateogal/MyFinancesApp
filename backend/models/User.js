const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
const spentTransactions = require('./SpentTransaction')
const incomeTransactions = require('./IncomeTransaction')
const bankAccounts = require('./BankAccount')
const bankCards = require('./BankCard')

const Session = new mongoose.Schema({
    refreshToken: {
        type: String,
        default: "",
    },
})

const UserSchema = new mongoose.Schema({
    username: {
        'type': String,
        required: true,
        unique: true,
        trim: true
    },
    firstName: {
        'type': String,
        required: false,
        trim: true
    },
    lastName: {
        'type': String,
        required: false,
        trim: true
    },
    email: {
        'type': String,
        required: false,
        unique: true,
        trim: true
    },
    password: {
        'type': String,
        rquired: true,
        trim: true
    },
    accountBalance: {
        'type': Number,
        required: true,
        trim: true
    },
    totalSpent: {
        type: Number,
        required: true,
        trim: true
    },
    totalIncome: {
        type: Number,
        required: true,
        trim: true
    },
    refreshToken: {
        type: [Session],
    },
    spentTransactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpentTransaction"
    }],
    incomeTransactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "IncomeTransaction"
    }],
    bankAccounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount'
    }],
    bankCards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankCard'
    }]
})

UserSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.refreshToken
        return ret
    },
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);