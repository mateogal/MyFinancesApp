import React, { useContext, useState, useEffect } from "react"
import 'moment-timezone';
import LoadModal from "../components/LoadModal"
import Cards from '../components/HomeCards'
import Tables from '../components/Tables'
import { UserContext } from "../context/UserContext"
const axios = require('axios')

const API_URL = process.env.REACT_APP_API_URL

const Banks = (props) => {

    const [fetchingData, setFetchingData] = useState(true)
    const [userContext, setUserContext] = useContext(UserContext)
    const [bankAccounts, setBankAccounts] = useState([])
    const [bankCards, setBankCards] = useState([])

    axios.defaults.withCredentials = true
    axios.defaults.headers.common['Authorization'] = `Bearer ${userContext.token}`

    const allPromises = Promise.all([
        axios.get(API_URL + '/account/banks', {}),
        axios.get(API_URL + '/account/banks/card', {})
    ]);

    const fetchData = async () => {
        setFetchingData(true)
        try {
            const responses = await allPromises
            setBankAccounts(responses[0].data.bankAccounts)
            setBankCards(responses[1].data.bankCards)
            setFetchingData(false)
        } catch (error) {
            console.log(error)
            setFetchingData(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const cardsColumns = [
        {
            header: "Banco",
            accessorKey: "bankName"
        },
        {
            header: "Tipo",
            accessorKey: "type",
        },
        {
            header: "Compañia",
            accessorKey: "company",
        },
        {
            header: "Numero Tarjeta",
            accessorKey: "number",
        },
        {
            header: "Balance",
            accessorKey: "balance",
            Cell: ({ cell }) => (
                "$ " + cell.getValue()
            )
        },
        {
            header: "Cuenta Asociada",
            accessorKey: "bankAccount"
        }
    ]

    return (
        <div className="container-fluid p-5">
            {fetchingData && <LoadModal />}
            <div className="row g-3 justify-content-center">
                {Object.entries(bankAccounts).map(([index, account]) => {
                    return (
                        <div key={account._id} className="col-12 col-md-4 col-xxl-3">
                            <Cards
                                title={account.bankName + " / " + account.currency}
                                body={'$ ' + account.balance}
                                footerText={"N. Cuenta: " + account.accountNumber}
                                footerId={account._id}
                            />
                        </div>
                    )
                })}
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <Tables title={"Tarjetas"} data={bankCards} columns={cardsColumns} />
                </div>
            </div>
        </div>
    )
}

export default Banks