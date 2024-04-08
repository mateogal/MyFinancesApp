const express = require('express')
const router = express.Router({mergeParams: true})

const {
   accountBalance,
   openOrders,
   allOrders,
   fiatBuyHistory,
   fiatSellHistory,
   allSavings,
   cryptoChecker,
   test

} = require('../controllers/binanceController')

router.route('/').get(accountBalance)
router.route('/orders/open').get(openOrders)
router.route('/orders').get(allOrders)
router.route('/fiat/buy/history').get(fiatBuyHistory)
router.route('/fiat/sell/history').get(fiatSellHistory)
router.route('/savings').get(allSavings)
router.route('/cryptos').get(cryptoChecker)

router.route('/test').get(test)

module.exports = router