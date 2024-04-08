import { React, useCallback, useContext, useEffect, useState } from "react"
import Dashboard from './Dashboard'
import Login from './views/Login'
import Logout from './views/Logout'
import Register from './views/Register'
import Home from './views/Home'
import Cryptos from './views/Cryptos'
import Transaction from './views/Transactions'
import Banks from './views/Banks'
import LoadModal from "./components/LoadModal"
import { UserContext } from "./context/UserContext"

import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate
} from "react-router-dom";

const axios = require('axios')
axios.defaults.withCredentials = true

function App(props) {
   const API_URL = process.env.REACT_APP_API_URL
   const APP_NAME = props.appName
   const [userContext, setUserContext] = useContext(UserContext)

   const verifyUser = useCallback(() => {
      axios.post(API_URL + "/auth/refreshToken")
         .then(response => {
            setUserContext(oldValues => {
               return { ...oldValues, token: response.data.token }
            })
            setTimeout(verifyUser, 5 * 60 * 1000)
         })
         .catch(errors => {
            console.log(errors.toJSON())
            setUserContext(oldValues => {
               return { ...oldValues, token: null }
            })
         })
   }, [setUserContext])

   useEffect(() => {
      verifyUser()
   }, [verifyUser])

   const syncLogout = useCallback(event => {
      if (event.key === "logout") {
         window.location.reload()
      }
   }, [])

   useEffect(() => {
      window.addEventListener("storage", syncLogout)
      return () => {
         window.removeEventListener("storage", syncLogout)
      }
   }, [syncLogout])

   return userContext.token === null ? (
      <Router>
         <Routes>
            <Route index path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
               path="*"
               element={<Navigate to="/login" />}
            />
         </Routes>
      </Router>
   ) : userContext.token ? (
      <Router>
         <Routes>
            <Route path="/" element={<Dashboard appName={APP_NAME} />}>
               <Route path="cryptos" element={<Cryptos />} />
               <Route path="transactions" element={<Transaction />} />
               <Route path="banks" element={<Banks />} />
               <Route path="logout" element={<Logout />} />
               <Route index element={<Home />} />
               <Route
                  path="*"
                  element={<Navigate to="/" />}
               />
            </Route>
         </Routes>
      </Router>
   ) : (
      <LoadModal />
   )

}

export default App;
