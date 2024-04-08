const express = require('express')
const router = express.Router({ mergeParams: true })
const app = express()

const {
   createSpentTransaction,
   getTransactions,
   createCryptoTransaction,
   getCryptoTransactions,
   getTotalFiat,
   getPortfolio,
   getTotalCryptoInvested,
   createIncomeTransaction,
   accountBalance,
   balancePerMonth,
   balancePerYear,
   spentPerCategory,
   getBanks,
   createBank,
   createCard,
   getCards
} = require('../controllers/accountController.js')

const {
   verifyUser
} = require("../authenticate")

router.use(verifyUser)

router.route('/').get(accountBalance)
router.route('/balancePerMonth').get(balancePerMonth)
router.route('/balancePerYear').get(balancePerYear)
router.route('/spentPerCategory').get(spentPerCategory)
router.route('/transactions/crypto').get(getCryptoTransactions).post(createCryptoTransaction);
router.route('/transactions/income').post(createIncomeTransaction)
router.route('/transactions/spent').post(createSpentTransaction)
router.route('/transactions').get(getTransactions)
router.route('/fiat/total').get(getTotalFiat)
router.route('/cryptoPortfolio').get(getPortfolio)
router.route('/cryptoInvested').get(getTotalCryptoInvested)
router.route('/banks/card').get(getCards).post(createCard)
router.route('/banks').get(getBanks).post(createBank)

module.exports = router