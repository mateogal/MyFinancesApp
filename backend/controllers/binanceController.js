const ccxt = require ('ccxt')
const {Spot} = require('@binance/connector')
const lodashClonedeep = require('lodash.clonedeep');

var binanceClient = new ccxt.binance({
   'apiKey': process.env.API_KEY,
   'secret': process.env.API_SECRET,
})

const binanceConnector = new Spot(process.env.API_KEY, process.env.API_SECRET)

binanceClient.options['warnOnFetchOpenOrdersWithoutSymbol'] = false;

const cryptoChecker = async (req, res) => {
   try{
      if (!req.query.cryptos){
         res.status(400).json({message: 'Enter a valid Crypto symbol array'})
      }else{
         const cryptos = await binanceClient.fetchTickers(req.query.cryptos)
         res.status(200).json(cryptos)
      }
      
   }catch(err){
      console.log(err)
   }
}

const priceCalculate = async (crypto) => {
   try{
      if (crypto.asset !== 'USDT'){
         const tempCrypto = lodashClonedeep(crypto)
         if (tempCrypto.asset.startsWith('LD')){
            tempCrypto.asset = tempCrypto.asset.replace('LD','')
         }
         const cryptoInfo = await binanceClient.fetchTicker(tempCrypto.asset+'/USDT')
         const totalPrice = parseFloat((parseFloat(tempCrypto.locked) + parseFloat(tempCrypto.free)) * cryptoInfo.bid)
         return totalPrice
      }else{
         const totalPrice = parseFloat((parseFloat(crypto.locked) + parseFloat(crypto.free)))
         return totalPrice
      }
   }catch(err){
      console.log(err)
   }
}

const accountBalance = async (req, res) => {
   try{
      let balance = {
         cryptos: await binanceClient.fetchBalance(),
         totalUSD: 0
      }
      balance.cryptos = await balance.cryptos.info.balances.filter( crypto => crypto.free > 0 || crypto.locked > 0)
      await Promise.all(balance.cryptos.map(async (crypto) => {
         crypto.priceUSD = await priceCalculate(crypto)
         balance.totalUSD += parseFloat(crypto.priceUSD)
       }));
      res.status(200).json(balance)
   }catch(err){
      console.log(err)
   }
}

const openOrders = async (req, res) => {
   try{
      const orders = await binanceClient.fetchOpenOrders()
      res.status(200).json(orders)
   }catch(err){
      console.log(err)
   }
}

const allOrders = async (req, res) => {
   try{
      const orders = await binanceClient.fetchOrders()
      res.status(200).json(orders)
   }catch(err){
      console.log(err)
   }
}

const fiatBuyHistory = async (req, res) => {
   try{
      const transactions = await binanceConnector.paymentHistory(0)
      res.status(200).json(transactions.data)
   }catch(err){
      console.log(err)
   }
}

const fiatSellHistory = async (req, res) => {
   try{
      const transactions = await binanceConnector.paymentHistory(1)
      console.log(transactions)
      res.status(200).json(transactions.data)
   }catch(err){
      console.log(err)
   }
}

const allSavings = async (req, res) => {
   try{
      const savings = await binanceConnector.savingsAccount()
      console.log(savings)
      res.status(200).json(savings.data)
   }catch(err){
      console.log(err)
   }
}

const test = async (req, res) => {
   try {
      // const response = await binanceClient.fetchTickers(['ADA/USDT', 'SOL/USDT'])
      const response = await binanceClient.fetchBalance()
      console.log(response)
      res.json(response)
   } catch (error) {
      console.log(error)
   }
}

module.exports = {
   accountBalance,
   openOrders,
   allOrders,
   fiatBuyHistory,
   fiatSellHistory,
   allSavings,
   cryptoChecker,
   test
}