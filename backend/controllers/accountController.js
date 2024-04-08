const CryptoTransaction = require('../models/CryptoTransaction')
const SpentTransaction = require('../models/SpentTransaction')
const IncomeTransaction = require('../models/IncomeTransaction')
const BankAccount = require('../models/BankAccount')
const BankCard = require('../models/BankCard')
const Portfolio = require('../models/Portfolio')
const CMC = require('../controllers/coinmarketcapController')

const ccxt = require('ccxt')

var binanceClient = new ccxt.binance({
   'apiKey': process.env.API_KEY,
   'secret': process.env.API_SECRET,
})

binanceClient.options['warnOnFetchOpenOrdersWithoutSymbol'] = false;

const createCryptoTransaction = async (req, res) => {
   try {
      let transaction = await CryptoTransaction.create(req.body)
      try {
         let portfolioCrypto = await Portfolio.findOne({ symbol: (req.body.symbol).split('/')[0] })
         if (!portfolioCrypto) {
            const cryptoInfo = {
               symbol: (req.body.symbol).split('/')[0],
               quantity: req.body.quantity,
               avgPrice: req.body.cryptoPrice,
               totalFiat: req.body.totalFiat
            }
            portfolioCrypto = await Portfolio.create(cryptoInfo)
         } else {
            if (transaction.symbol !== 'USDT/USDT' && transaction.symbol !== 'BUSD/BUSD') {
               // const cryptoPrice = (await binanceClient.fetchTicker(transaction.symbol)).bid
               if (transaction.type !== 'sell' && transaction.type !== 'staking') {
                  portfolioCrypto.avgPrice = parseFloat((portfolioCrypto.avgPrice + transaction.cryptoPrice) / 2).toFixed(3)
               }
            }
            if (transaction.type === 'sell') {
               portfolioCrypto.quantity -= transaction.quantity
               portfolioCrypto.totalFiat -= transaction.totalFiat
            } else {
               portfolioCrypto.quantity += transaction.quantity
               portfolioCrypto.totalFiat += transaction.totalFiat
            }
            await portfolioCrypto.save()
         }
         if (transaction.type === 'trade') {
            var fiat = await Portfolio.findOne({ symbol: transaction.fiat })
            fiat.quantity -= transaction.totalFiat
            await fiat.save()
         }
         if (transaction.type === 'sell') {
            var fiat = await Portfolio.findOne({ symbol: transaction.fiat })
            fiat.quantity += transaction.totalFiat
            await fiat.save()
         }
         if (transaction.type === 'swap') {
            var fiat = await Portfolio.findOne({ symbol: transaction.fiat })
            fiat.quantity -= transaction.swapQty
            fiat.totalFiat -= transaction.totalFiat
            await fiat.save()
         }
         res.status(201).json({
            transaction: transaction,
            updatedPortfolio: portfolioCrypto
         })
      } catch (error) {
         console.log(error)
         res.status(400).json(error)
      }
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const getCryptoTransactions = async (req, res) => {
   try {
      if (req.query.limit) {
         var transactions = await CryptoTransaction.find().sort({ date: -1 }).limit(parseInt(req.query.limit)).lean()
      } else {
         var transactions = await CryptoTransaction.find().sort({ date: -1 }).lean()
      }
      res.status(200).json(transactions)
   } catch (error) {
      res.status(400).json(error)
   }
}

const getTotalFiat = async (req, res) => {
   try {
      const transactions = await CryptoTransaction.find().lean()
      let totalBuy = totalSell = 0
      for (transaction of transactions) {
         (transaction.type == 'buy') ? totalBuy += parseFloat(transaction.totalFiat) : totalSell += parseFloat(transaction.totalFiat)
      }
      res.status(200).json({
         totalBuy: totalBuy,
         totalSell: totalSell
      })
   } catch (error) {
      res.status(400).json(error)
   }
}

const getPortfolio = async (req, res) => {
   try {
      const portfolio = await Portfolio.find().where('symbol').nin(['BUSD', 'USDT']).sort({ quantity: -1 }).lean()
      let accBalance = totalProfit = 0;
      for (const key in portfolio) {
         const crypto = portfolio[key]
         if (crypto.symbol != 'BUSD' && crypto.symbol != 'USDT') {
            var currentPrice = 0
            try {
               currentPrice = (await binanceClient.fetchTicker(crypto.symbol + '/USDT')).bid
            } catch (err) {
               currentPrice = (await CMC.getCrypto(crypto.symbol)).data[crypto.symbol].quote.USD.price
            }
            var profit = (currentPrice * crypto.quantity) - crypto.totalFiat
            crypto['profit'] = profit
            crypto['totalUSD'] = currentPrice * crypto.quantity
            totalProfit += profit
            accBalance += currentPrice * crypto.quantity
         }
      }
      const response = {
         portfolio: portfolio,
         accBalance: parseFloat(accBalance).toFixed(3),
         totalProfit: parseFloat(totalProfit).toFixed(3)
      }
      res.status(200).json(response)
   } catch (error) {
      res.status(400).json(error)
   }
}

const getTotalCryptoInvested = async (req, res) => {
   try {
      const totalUSD = await CryptoTransaction.aggregate().match({ type: 'buy' }).group({ _id: null, total: { $sum: '$totalFiat' } }).exec()
      const totalLocalFiat = await CryptoTransaction.aggregate().match({ type: 'buy' }).group({ _id: null, total: { $sum: '$totalLocalFiat' } }).exec()
      var response = {
         totalUSD: totalUSD[0].total,
         totalLocalFiat: totalLocalFiat[0].total
      }
      res.status(200).json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const getTransactions = async (req, res) => {
   try {
      const transactions = await req.user.populate(["spentTransactions", "incomeTransactions"])
      res.status(200).json({
         "incomeTransactions": transactions.incomeTransactions,
         "spentTransactions": transactions.spentTransactions
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const createSpentTransaction = async (req, res) => {
   try {
      req.body.user_id = req.user._id
      const transaction = await SpentTransaction.create(req.body)
      if (req.body.type === 'Debito') {
         const bankAccount = await BankAccount.findById(req.body.accountOrCardId)
         bankAccount.balance = parseFloat(req.body.amount) - parseFloat(bankAccount.balance)
         bankAccount.save()
      }
      if (req.body.type != 'Credito') {
         req.user.accountBalance = parseFloat(req.user.accountBalance) - parseFloat(req.body.price)
      }
      req.user.spentTransactions.push(transaction._id)
      req.user.totalSpent = parseFloat(req.user.totalSpent) + parseFloat(req.body.price)
      req.user.save(function (err) {
         if (err) res.status(400).json(err)
      })
      res.status(200).json(transaction)

   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const createIncomeTransaction = async (req, res) => {
   try {
      req.body.user_id = req.user._id
      if (req.body.type === 'Efectivo') {
         req.body.destination = 'Efectivo'
      }
      const transaction = await IncomeTransaction.create(req.body)
      if (req.body.type === 'Debito') {
         const bankAccount = await BankAccount.findById(req.body.accountOrCardId)
         bankAccount.balance = parseFloat(req.body.amount) + bankAccount.balance
         bankAccount.save()
      }
      req.user.incomeTransactions.push(transaction._id)
      req.user.accountBalance = parseFloat(req.body.amount) + parseFloat(req.user.accountBalance)
      req.user.totalIncome = parseFloat(req.user.totalIncome) + parseFloat(req.body.amount)
      req.user.save(function (err) {
         if (err) {
            res.status(400).json(err)
         } else {
            res.status(200).json(transaction)
         }
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const accountBalance = async (req, res) => {
   try {
      const userData = await req.user.populate(["bankAccounts", "bankCards"])
      res.status(200).json({
         "user": userData,
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const balancePerMonth = async (req, res) => {
   try {
      let totalIncome = await IncomeTransaction.aggregate(
         [
            {
               '$match': {
                  'user_id': (req.user._id).toString()
               }
            }, {
               '$group': {
                  '_id': {
                     '$dateToString': {
                        'format': '%m',
                        'date': '$date'
                     }
                  },
                  'amount': {
                     '$sum': '$amount'
                  }
               }
            }
         ]
      ).exec()

      let totalSpent = await SpentTransaction.aggregate(
         [
            {
               '$match': {
                  'user_id': (req.user._id).toString()
               }
            }, {
               '$group': {
                  '_id': {
                     '$dateToString': {
                        'format': '%m',
                        'date': '$date'
                     }
                  },
                  'amount': {
                     '$sum': '$price'
                  }
               }
            }
         ]
      ).exec()

      res.status(200).json({
         incomePerMonth: totalIncome,
         spentPerMonth: totalSpent
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const spentPerCategory = async (req, res) => {
   try {
      let totalSpent = await SpentTransaction.aggregate(
         [
            {
               '$match': {
                  'user_id': (req.user._id).toString()
               }
            }, {
               '$group': {
                  _id: "$category",
                  amount: {
                     $sum: "$price"
                  }
               }
            }
         ]
      ).exec()

      res.status(200).json({
         spentPerCategory: totalSpent
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const balancePerYear = async (req, res) => {
   try {
      let totalIncome = await IncomeTransaction.aggregate(
         [
            {
               '$match': {
                  'user_id': (req.user._id).toString()
               }
            }, {
               '$group': {
                  _id: { $dateToString: { format: "%Y", date: "$date" } },
                  amount: {
                     $sum: "$amount"
                  }
               }
            }
         ]
      ).exec()

      let totalSpent = await SpentTransaction.aggregate(
         [
            {
               '$match': {
                  'user_id': (req.user._id).toString()
               }
            }, {
               '$group': {
                  _id: { $dateToString: { format: "%Y", date: "$date" } },
                  amount: {
                     $sum: "$price"
                  }
               }
            }
         ]
      ).exec()

      res.status(200).json({
         incomePerYear: totalIncome,
         spentPerYear: totalSpent
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const getBanks = async (req, res) => {
   try {
      const banks = await req.user.populate(['bankAccounts'])
      res.status(200).json({
         'bankAccounts': banks.bankAccounts
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const getCards = async (req, res) => {
   try {
      const cards = await req.user.populate(["bankCards"])
      res.status(200).json({
         'bankCards': cards.bankCards
      })
   } catch (error) {
      console.log(error)
      res.status(400).json(error)
   }
}

const createBank = async (req, res) => {
   try {
      req.body.user_id = req.user._id
      const bank = await BankAccount.create(req.body)
      req.user.bankAccounts.push(bank._id)
      if (req.body.currency === 'UYU') {
         req.user.accountBalance += bank.balance
         req.user.totalIncome += bank.balance
      }
      req.user.save()
      res.status(200).json(bank)
   } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
         res.status(500).json(
            {
               'errors': [
                  {
                     message: "El Numero de Cuenta ya existe."
                  }
               ]
            }
         )
      } else {
         res.status(500).json(error)
      }
   }
}

const createCard = async (req, res) => {
   try {
      req.body.user_id = req.user._id
      let card
      if (req.body.bankAccount_id) {
         const bankAccount = await BankAccount.findById(req.body.bankAccount_id)
         req.body.bankName = bankAccount.bankName
         req.body.bankAccount = bankAccount.accountNumber
         card = await BankCard.create(req.body)
         bankAccount.cards.push(card)
         bankAccount.save()

      } else {
         card = await BankCard.create(req.body)
      }
      req.user.bankCards.push(card)
      req.user.save()
      res.status(200).json(card)
   } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
         res.status(500).json(
            {
               'errors': [
                  {
                     message: "El Numero de Tarjeta ya existe."
                  }
               ]
            }
         )
      } else {
         res.status(500).json(error)
      }
   }
}

module.exports = {
   createCryptoTransaction,
   getCryptoTransactions,
   getTotalFiat,
   getPortfolio,
   getTotalCryptoInvested,
   getTransactions,
   createSpentTransaction,
   createIncomeTransaction,
   accountBalance,
   balancePerMonth,
   spentPerCategory,
   balancePerYear,
   getBanks,
   createBank,
   createCard,
   getCards
}