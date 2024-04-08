import React, { useContext, useState, useEffect } from "react"
import Cards from '../components/HomeCards'
import Tables from '../components/CryptoTables'
import LoadModal from '../components/LoadModal'
import { UserContext } from "../context/UserContext"
const axios = require('axios')

const API_URL = process.env.REACT_APP_API_URL

const Cryptos = () => {
   const [cryptos, setCryptos] = useState([])
   const [accBalance, setAccBalance] = useState(0)
   const [portfolio, setPortfolio] = useState([])
   const [accTotalAPY, setAccTotalAPY] = useState(0)
   const [transactHist, setTransactHist] = useState([])
   const [invested, setInvested] = useState([])
   const [fetchingData, setFetchingData] = useState(true)
   const [userContext, setUserContext] = useContext(UserContext)

   axios.defaults.withCredentials = true
   axios.defaults.headers.common['Authorization'] = `Bearer ${userContext.token}`

   const allPromises = Promise.all([
      axios.get(API_URL + '/binance/cryptos', {
         params: {
            cryptos: ['ADA/USDT', 'SOL/USDT', 'BTC/USDT', 'SHIB/USDT', 'MANA/USDT', 'ETH/USDT', 'MOVR/USDT', 'VET/USDT', 'DOT/USDT']
         }
      }),
      axios.get(API_URL + '/account/cryptoPortfolio'),
      axios.get(API_URL + '/account/transactions/crypto', {
         // params: {
         // 	limit: 10
         // }
      }),
      axios.get(API_URL + '/account/cryptoInvested'),
   ])

   useEffect(() => {
      const fetchData = async () => {
         try {
            const responses = await allPromises;
            setAccBalance(responses[1].data.accBalance)
            setCryptos(responses[0].data)
            setPortfolio(responses[1].data.portfolio)
            setTransactHist(responses[2].data)
            setAccTotalAPY(responses[1].data.totalProfit)
            setInvested(responses[3].data)

            if (accTotalAPY < 0) {
               document.getElementById('acc_total_apy').classList.add('text-danger')
            } else {
               document.getElementById('acc_total_apy').classList.add('text-success')
            }

            Object.entries(cryptos).forEach(crypto => {
               const element = document.getElementById(crypto[1].symbol)
               if (crypto[1].change < 0) {
                  element.classList.add('text-danger')
               } else {
                  element.classList.add('text-success')
               }
               element.innerText = '$ ' + crypto[1].change + ' / ' + crypto[1].percentage + '%'
            })
         } catch (error) {
            console.log(error)
         }
      }
      fetchData()
      setFetchingData(false)
   }, [])

   return (
      <div className="container-fluid mt-5">
         <div className="row">
            <div className="col-12 col-md-4 col-xxl-3">
               <div className="row">
                  <div className="col-12 col-xxl-6">
                     <Cards title="Account Balance" body={'$ ' + accBalance} bodyId="acc_balance" />
                  </div>
                  <div className="col-12 mt-3 mt-xxl-0 col-xxl-6">
                     <Cards title="Total Profit" body={'$ ' + accTotalAPY} bodyId="acc_total_apy" />
                  </div>
                  <div className="col-12 mt-3 col-xxl-6">
                     <Cards
                        title="Total Invested USD"
                        body={'$ ' + invested.totalUSD}
                        bodyId="total_invested_usd"
                     />
                  </div>
                  <div className="col-12 mt-3 col-xxl-6">
                     <Cards
                        title="Total Invested UYU"
                        body={'$ ' + invested.totalLocalFiat}
                        bodyId="total_invested_uyu"
                     />
                  </div>
               </div>
            </div>
            <div className="col-12 col-md">
               <div className="row g-3 justify-content-center">
                  {Object.entries(cryptos).map(([index, crypto]) => {
                     return (
                        <div key={crypto.symbol} className="col-12 col-md-4 col-xxl-2">
                           <Cards title={crypto.symbol} body={'$ ' + crypto.bid} footerText="Cambio 24HS: " footerId={crypto.symbol} />
                        </div>
                     )
                  })}
               </div>
            </div>
            <Tables portfolio={portfolio} transactHist={transactHist} />
         </div>
         {fetchingData && <LoadModal />}
      </div>
   )
}

export default Cryptos