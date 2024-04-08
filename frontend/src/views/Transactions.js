import React, { useContext, useState, useEffect } from "react"
import Tables from '../components/Tables'
import Moment from 'react-moment';
import 'moment-timezone';
import LoadModal from "../components/LoadModal";
import { UserContext } from "../context/UserContext"
const axios = require('axios')

const API_URL = process.env.REACT_APP_API_URL

const Transactions = (props) => {
    const [spentTransactions, setSpentTransactions] = useState([])
    const [incomeTransactions, setIncomeTransactions] = useState([])
    const [fetchingData, setFetchingData] = useState(true)
    const [userContext, setUserContext] = useContext(UserContext)

    axios.defaults.withCredentials = true
    axios.defaults.headers.common['Authorization'] = `Bearer ${userContext.token}`

    const allPromises = Promise.all([
        axios.get(API_URL + '/account/transactions', {
            params: {
                limit: 100
            },
        })
    ])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await allPromises;
                setSpentTransactions(responses[0].data.spentTransactions)
                setIncomeTransactions(responses[0].data.incomeTransactions)
                setFetchingData(false)
            } catch (error) {
                setFetchingData(false)
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const spentColumns = [
        {
            header: "Fecha",
            accessorKey: "date",
            type: "date",
            Cell: ({ cell }) => (
                <Moment format="DD-MM-YYYY" parse="YYYY-MM-DD">{cell.getValue()}</Moment>
            ),
        },
        {
            header: "Producto",
            accessorKey: "product",
        },
        {
            header: "Precio",
            accessorKey: "price",
            Cell: ({ cell }) => (
                "$ " + cell.getValue()
            )
        },
        {
            header: "Categoria",
            accessorKey: "category",
        },
        {
            header: "Lugar",
            accessorKey: "location",
        },
        {
            header: "Desde",
            accessorKey: "from",
        }
    ]
    const incomeColumns = [
        {
            header: "Fecha",
            accessorKey: "date",
            type: "date",
            Cell: ({ cell }) => (
                <Moment format="DD-MM-YYYY" parse="YYYY-MM-DD">{cell.getValue()}</Moment>
            ),
        },
        {
            header: "Monto",
            accessorKey: "amount",
            Cell: ({ cell }) => (
                "$ " + cell.getValue()
            )
        },
        {
            header: "Ingreso desde",
            accessorKey: "from",
        },
        {
            header: "Destino",
            accessorKey: "destination",
        },
    ]
    return (
        <div className="container-fluid pt-5">
            {fetchingData && <LoadModal />}
            <div className="row mt-3">
                <div className="col-12 col-md">
                    <div className="row g-3 justify-content-center">
                        <div className="col-12 ">
                            <Tables title={"Transacciones de egreso"} data={spentTransactions} columns={spentColumns} />
                        </div>
                        <div className="col-12 ">
                            <Tables title={"Transacciones de ingreso"} data={incomeTransactions} columns={incomeColumns} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions