import React, { useContext, useState, useEffect, useRef } from "react"
import Cards from '../components/HomeCards'
import Charts from '../components/Charts'
import MessageModal from '../components/MessageModal'
import FormModal from '../components/FormModal'
import { UserContext } from "../context/UserContext"
import 'moment-timezone';
import LoadModal from "../components/LoadModal"

const axios = require('axios')

const API_URL = process.env.REACT_APP_API_URL

const Home = () => {
   const [totalIncome, setTotalIncome] = useState(0)
   const [totalSpent, setTotalSpent] = useState(0)
   const [balance, setBalance] = useState(0)
   const [bankAccounts, setBankAccounts] = useState([])
   const [bankCards, setBankCards] = useState([])
   const [incomePerMonth, setIncomePerMonth] = useState([])
   const [spentPerMonth, setSpentPerMonth] = useState([])
   const [incomePerYear, setIncomePerYear] = useState([])
   const [spentPerYear, setSpentPerYear] = useState([])
   const [spentPerCategory, setSpentPerCategory] = useState([])
   const [modalBody, setModalBody] = useState([])
   const [fetchStatus, setFetchStatus] = useState(false)
   const [modalType, setModalType] = useState("success")
   const [fetchingData, setFetchingData] = useState(true)
   const [userContext, setUserContext] = useContext(UserContext)
   const [fetchDataResult, setFetchDataResult] = useState(false)
   const initialRender = useRef(true)

   axios.defaults.withCredentials = true
   axios.defaults.headers.common['Authorization'] = `Bearer ${userContext.token}`

   const allPromises = Promise.all([
      axios.get(API_URL + '/account', {}),
      axios.get(API_URL + '/account/balancePerMonth', {}),
      axios.get(API_URL + '/account/spentPerCategory', {}),
      axios.get(API_URL + '/account/balancePerYear', {})
   ]);

   const handleChangeType = (event) => {
      const type = event.target.value
      const spentDiv = document.getElementById("spentDiv")
      const incomeDiv = document.getElementById("incomeDiv")
      const accountCardSelect = document.getElementById("transactionAccountCard")
      accountCardSelect.replaceChildren()
      accountCardSelect.append(
         new Option(
            '',
            'default'
         ),
         new Option(
            'Efectivo',
            'cash'
         )
      )
      bankAccounts.forEach((account) => {
         accountCardSelect.append(
            new Option(
               'Debito / ' + account.accountNumber + ' / ' + account.bankName + ' ' + account.currency,
               account._id
            )
         )
      })
      if (type === "Income") {
         spentDiv.style.display = "none"
         incomeDiv.style.display = "block"
      } else {
         bankCards.forEach((card) => {
            if (card.type === 'Credito') {
               accountCardSelect.append(
                  new Option(
                     'Credito / ' + card.number + ' / ' + card.bankName,
                     card._id
                  )
               )
            }
         })
         spentDiv.style.display = "block"
         incomeDiv.style.display = "none"
      }
   }

   const addIncomeTransaction = () => {
      setFetchingData(true)
      const from = document.getElementById('from').value
      const amount = document.getElementById('amount').value
      const date = document.getElementById('date').value
      const accountOrCardId = document.getElementById('transactionAccountCard').value
      const type = (document.getElementById('transactionAccountCard').selectedOptions[0].innerText).split(" / ")[0]
      const destination = (document.getElementById('transactionAccountCard').selectedOptions[0].innerText).split(" / ")[1]
      axios.post(API_URL + '/account/transactions/income', {
         from: from,
         amount: amount,
         date: date,
         type: type,
         destination: destination,
         accountOrCardId: accountOrCardId
      })
         .then((response) => {
            setFetchingData(false)
            setFetchStatus("Response")
            setModalType("success")
            setModalBody(["Transaccion de ingreso añadida correctamente."])
            console.log(response);
            setFetchDataResult(response)
         })
         .catch((error) => {
            setFetchingData(false)
            setFetchStatus("Errors")
            setModalType("danger")
            if (error.response) {
               console.log(error.response.data.errors)
               let errors = []
               for (const item in error.response.data.errors) {
                  errors.push(error.response.data.errors[item].message)
               }
               setModalBody(errors)
            } else if (error.request) {
               setModalBody(error.request)
            } else {
               setModalBody('Error' + error.message)
            }
            console.log(error.config)
         })
   }

   const addSpentTransaction = () => {
      setFetchingData(true)
      const product = document.getElementById('product').value
      const price = document.getElementById('price').value
      const category = document.getElementById('categorySelect').value
      const location = document.getElementById('location').value
      const date = document.getElementById('date').value
      const accountOrCardId = document.getElementById('transactionAccountCard').value
      const type = (document.getElementById('transactionAccountCard').selectedOptions[0].innerText).split(" / ")[0]
      const from = (document.getElementById('transactionAccountCard').selectedOptions[0].innerText).split(" / ")[1]
      axios.post(API_URL + '/account/transactions/spent', {
         product: product,
         price: price,
         category: category,
         location: location,
         date: date,
         type: type,
         from: from,
         accountOrCardId: accountOrCardId
      })
         .then((response) => {
            setFetchStatus("Response")
            setModalType("success")
            setModalBody(["Transaccion de egreso añadida correctamente."])
            setFetchDataResult(response)
            setFetchingData(false)
         })
         .catch((error) => {
            setFetchStatus("Errors")
            setModalType("danger")
            if (error.response) {
               let errors = []
               for (const item in error.response.data.errors) {
                  errors.push(error.response.data.errors[item].message)
               }
               setModalBody(errors)
            } else if (error.request) {
               setModalBody(error.request)
            } else {
               setModalBody('Error' + error.message)
            }
            console.log(error.config)
            setFetchingData(false)
         })

   }

   const addTransaction = () => {
      const transactionType = document.getElementById('transactionType').value
      if (transactionType === 'Spent') {
         addSpentTransaction()
      } else if (transactionType === 'Income') {
         addIncomeTransaction()
      } else {
         setFetchStatus("Errors")
         setModalType("danger")
         setModalBody(["Tipo de transaccion inválida."])
      }
   }

   const addBankAccount = () => {
      setFetchingData(true)
      let bankName = document.getElementById("bankName").value
      let accountNumber = document.getElementById("accountNumber").value
      let currency = document.getElementById("currency").value
      let balance = document.getElementById("initialBalance").value
      axios.post(API_URL + '/account/banks', {
         bankName: bankName,
         accountNumber: accountNumber,
         currency: currency,
         balance: balance
      }).then((response) => {
         setFetchStatus("Response")
         setModalType("success")
         setModalBody(["Cuenta ingresada correctamente."])
         setFetchDataResult(response)
         setFetchingData(false)
      }).catch((error) => {
         setFetchStatus("Errors")
         setModalType("danger")
         console.log(error.response.data)
         if (error.response) {
            let errors = []
            for (const item in error.response.data.errors) {
               errors.push(error.response.data.errors[item].message)
            }
            setModalBody(errors)
         } else if (error.request) {
            setModalBody(error.request)
         } else {
            setModalBody('Error' + error.message)
         }
         console.log(error.config)
         setFetchingData(false)
      })
   }

   const handleNumCuenta = (e) => {
      if (e.target.value != '') {
         const accountData = bankAccounts.find(item => item._id === e.target.value)
         document.getElementById('cardBankName').value = accountData.bankName
         document.getElementById('cardBankName').disabled = true
      } else {
         document.getElementById('cardBankName').value = ''
         document.getElementById('cardBankName').disabled = false
      }

   }

   const addBankCard = () => {
      const bankAccount_id = document.getElementById("cardBankAccount").value
      const number = document.getElementById("cardNumber").value
      const type = document.getElementById("cardType").value
      const payDay = parseInt(document.getElementById("payDay").value)
      const balance = 0
      const bankName = document.getElementById("cardBankName").value
      const company = document.getElementById("cardCompany").value
      if (payDay < 1 || payDay > 31 || isNaN(payDay)) {
         alert("Dia de pago no valido")
         return
      }
      if (number === '' && type === 'Debito') {
         alert('Numero de cuenta no valido.')
         return
      }
      setFetchingData(true)
      axios.post(API_URL + '/account/banks/card', {
         bankAccount_id: bankAccount_id,
         number: number,
         type: type,
         payDay: payDay,
         balance: balance,
         bankName: bankName,
         company: company
      }).then((response) => {
         setFetchStatus("Response")
         setModalType("success")
         setModalBody(["Tarjeta agregada correctamente."])
         setFetchDataResult(response)
         setFetchingData(false)
      }).catch((error) => {
         setFetchStatus("Errors")
         setModalType("danger")
         if (error.response) {
            let errors = []
            for (const item in error.response.data.errors) {
               errors.push(error.response.data.errors[item].message)
            }
            setModalBody(errors)
         } else if (error.request) {
            setModalBody(error.request)
         } else {
            setModalBody('Error' + error.message)
         }
         console.log(error.config)
         setFetchingData(false)
      })
   }

   const fetchData = async () => {
      setFetchingData(true)
      try {
         const responses = await allPromises;
         setBalance(responses[0].data.user.accountBalance)
         setTotalIncome(responses[0].data.user.totalIncome)
         setTotalSpent(responses[0].data.user.totalSpent)
         setBankAccounts(responses[0].data.user.bankAccounts)
         setBankCards(responses[0].data.user.bankCards)
         setIncomePerMonth(responses[1].data.incomePerMonth)
         setSpentPerMonth(responses[1].data.spentPerMonth)
         setSpentPerCategory(responses[2].data.spentPerCategory)
         setIncomePerYear(responses[3].data.incomePerYear)
         setSpentPerYear(responses[3].data.spentPerYear)
         setUserContext(oldValues => {
            return { ...oldValues, details: responses[0].data.user }
         })
         if (responses[0].data.user.accountBalance < 0) {
            document.getElementById('balance').classList.add('text-danger')
         } else {
            document.getElementById('balance').classList.add('text-success')
         }
         setFetchingData(false)
      } catch (error) {
         setModalBody(error)
         setFetchStatus("Errors")
         setModalType("danger")
         console.log(error)
         setFetchingData(false)
      }
   }

   useEffect(() => {
      document.body.style.removeProperty("margin")
      fetchData()
      initialRender.current = true
   }, []);

   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false
      } else {
         fetchData()
      }
   }, [fetchDataResult])

   const handleMessageModal = () => {
      setFetchStatus(false)
   }

   const monthLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
   const categoryLabels = []
   let dataCategory = []
   for (let index = 0; index < spentPerCategory.length; index++) {
      categoryLabels.push(spentPerCategory[index]._id)
      dataCategory.push(spentPerCategory[index].amount)
   }

   const yearLabels = []
   let dataBalancePerYearIncome = []
   let dataBalancePerYearSpent = []
   for (let index = 0; index < incomePerYear.length; index++) {
      yearLabels.push(incomePerYear[index]._id)
      dataBalancePerYearIncome.push(incomePerYear[index].amount)
   }
   const emptyYears = (yearLabels.length === 0) ? true : false
   for (let index = 0; index < spentPerYear.length; index++) {
      if (emptyYears) {
         yearLabels.push(spentPerYear[index]._id)
      }
      dataBalancePerYearSpent.push(spentPerYear[index].amount)
   }

   if (yearLabels.length > 0) {
      yearLabels.unshift(yearLabels[0] - 5, yearLabels[0] - 4, yearLabels[0] - 3, yearLabels[0] - 2, yearLabels[0] - 1)
      dataBalancePerYearSpent.unshift(0, 0, 0, 0, 0)
      dataBalancePerYearIncome.unshift(0, 0, 0, 0, 0)
   }

   let dataBalanceIncome = monthLabels.map(() => 0)
   let dataBalanceSpent = monthLabels.map(() => 0)

   for (let index = 0; index < incomePerMonth.length; index++) {
      const monthIndex = (incomePerMonth[index]._id) - 1
      dataBalanceIncome[monthIndex] = incomePerMonth[index].amount
   }
   for (let index = 0; index < spentPerMonth.length; index++) {
      const monthIndex = (spentPerMonth[index]._id) - 1
      dataBalanceSpent[monthIndex] = spentPerMonth[index].amount
   }

   const datasetsBalance = [
      {
         label: 'Ingreso',
         data: dataBalanceIncome,
         backgroundColor: 'rgba(99, 255, 119, 0.85)',
      },
      {
         label: 'Egreso',
         data: dataBalanceSpent,
         backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
   ]
   const chartDataBalance = {
      labels: monthLabels,
      datasets: datasetsBalance
   }

   const datasetsBalancePerYear = [
      {
         label: 'Ingreso',
         data: dataBalancePerYearIncome,
         borderColor: 'rgb(53, 162, 235)',
         backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
         label: 'Egreso',
         data: dataBalancePerYearSpent,
         borderColor: 'rgb(255, 99, 132)',
         backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
   ]
   const chartDataBalancePerYear = {
      labels: yearLabels,
      datasets: datasetsBalancePerYear
   }

   const datasetsCategory = [
      {
         label: 'Categoria',
         data: dataCategory,
         backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
         ],
         borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
         ],
         borderWidth: 1,
      },
   ]
   const chartDataCategory = {
      labels: categoryLabels,
      datasets: datasetsCategory
   }

   const formNewBankAccountInputs = [
      {
         'label': 'Nombre Banco',
         'id': 'bankName',
         'type': 'text',
         'disabled': false
      },
      {
         'label': 'Num. Cuenta',
         'id': 'accountNumber',
         'type': 'text',
         'disabled': false
      },
      {
         'label': 'Balance Inicial',
         'id': 'initialBalance',
         'type': 'number',
         'disabled': false
      }
   ]

   const formNewBankAccountSelects = [
      {
         'label': 'Moneda',
         'id': 'currency',
         'options': [
            {
               'value': 'UYU',
               'text': 'UYU'
            },
            {
               'value': 'USD',
               'text': 'USD'
            },
            {
               'value': 'EUR',
               'text': 'EUR'
            },
         ],
         'disabled': false,
         'eventChange': false
      }
   ]

   const formNewBankCardInputs = [
      {
         'label': 'Num. Tarjeta',
         'id': 'cardNumber',
         'type': 'text',
         'disabled': false
      },
      {
         'label': 'Compañia',
         'id': 'cardCompany',
         'type': 'text',
         'disabled': false
      },
      {
         'label': 'Dia Cierre',
         'id': 'payDay',
         'type': 'number',
         'disabled': false
      },
      {
         'label': 'Banco',
         'id': 'cardBankName',
         'type': 'text',
         'disabled': false
      },
   ]

   const formNewBankCardSelects = [
      {
         'label': 'Cuenta Asociada',
         'id': 'cardBankAccount',
         'options':
            bankAccounts.map((account) => {
               return (
                  {
                     'value': account._id,
                     'text': account.accountNumber
                  }
               )
            }),
         'disabled': false,
         'eventChange': handleNumCuenta.bind(this)
      },
      {
         'label': 'Tipo',
         'id': 'cardType',
         'options': [
            {
               'value': 'Credito',
               'text': 'Credito'
            },
            {
               'value': 'Debito',
               'text': 'Debito'
            }
         ],
         'disabled': false,
         'eventChange': false
      }
   ]

   return (
      <div className="container-fluid p-5">
         <div className="row gy-3">
            <div className="col-12">
               <div className="row gy-3">
                  <div className="col-12 col-md">
                     <Cards title="Balance UYU" body={'$ ' + balance} bodyId="balance" />
                  </div>
                  <div className="col-12 col-md">
                     <Cards title="Total de Ingresos UYU" body={'$ ' + totalIncome} bodyId="totalIncome" />
                  </div>
                  <div className="col-12 col-md">
                     <Cards title="Total de Egresos UYU" body={'$ ' + totalSpent} bodyId="totalSpent" />
                  </div>
               </div>
            </div>
            <div className="col-12">
               <button id="newTransaction" className="btn btn-primary m-1" data-bs-target="#newTransactionModal" data-bs-toggle="modal">Nueva Transaccion</button>
               <button id="newBankAccount" className="btn btn-primary m-1" data-bs-target="#newBankAccountModal" data-bs-toggle="modal">Nueva Cuenta Banco</button>
               <button id="newBankCard" className="btn btn-primary m-1" data-bs-target="#newBankCardModal" data-bs-toggle="modal">Nueva Tarjeta</button>
            </div>
         </div>
         <div className="row gy-5 justify-content-between">
            <div className="col-12 col-lg-12">
               <Charts title="Balance por mes" data={chartDataBalance} type="bar" />
            </div>
            <div className="col-12 col-lg-6">
               <Charts title="Balance por año" data={chartDataBalancePerYear} type="line" />
            </div>
            <div className="col-12 col-lg-4">
               <Charts title="Egreso por categoria" data={chartDataCategory} type="pie" />
            </div>
         </div>
         <div className="modal fade" id="newTransactionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="newTransactionModal" aria-hidden="true">
            <div className="modal-dialog modal-lg">
               <div className="modal-content">
                  <div className="modal-header text-bg-dark">
                     <h1 className="modal-title fs-5" id="staticBackdropLabel">Nueva Transaccion</h1>
                     <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body text-bg-dark">
                     <form>
                        <div className="mb-3 row">
                           <div className="col-12">
                              <div className="form-floating">
                                 <select className="form-select" id="transactionType" defaultValue={'default'} onChange={handleChangeType.bind(this)}>
                                    <option value="default"></option>
                                    <option value="Income">Ingreso</option>
                                    <option value="Spent">Egreso</option>
                                 </select>
                                 <label className="text-dark" htmlFor="transactionType">Tipo Mov.</label>
                              </div>
                           </div>
                        </div>
                        <div id="spentDiv" style={{ display: "none" }}>
                           <div className="mb-3 row g-2">
                              <div className="col-md">
                                 <div className="form-floating">
                                    <input type="text" className="form-control" id="product" placeholder="Product" />
                                    <label className="text-dark" htmlFor="product">Producto</label>
                                 </div>
                              </div>
                              <div className="col-md">
                                 <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <div className="form-floating">
                                       <input type="number" className="form-control" id="price" placeholder="Price" />
                                       <label className="text-dark" htmlFor="price">Precio</label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="row mb-3 g-2">
                              <div className="col-md">
                                 <div className="form-floating">
                                    <select className="form-select" id="categorySelect" defaultValue={'default'}>
                                       <option value="default"></option>
                                       <option value="Ocio">Ocio</option>
                                       <option value="Necesario">Necesario</option>
                                       <option value="Hobby">Hobby</option>
                                       <option value="Comida">Comida</option>
                                       <option value="Regalo">Regalo</option>
                                       <option value="Medico">Medico</option>
                                    </select>
                                    <label className="text-dark" htmlFor="categorySelect">Categoria</label>
                                 </div>
                              </div>
                              <div className="col-md">
                                 <div className="form-floating">
                                    <input type="text" className="form-control" id="location" placeholder="Location" />
                                    <label className="text-dark" htmlFor="location">Lugar</label>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div id="incomeDiv" style={{ display: "none" }}>
                           <div className="mb-3 row g-2">
                              <div className="col-md">
                                 <div className="form-floating">
                                    <input type="text" className="form-control" id="from" placeholder="From" />
                                    <label className="text-dark" htmlFor="from">Procedencia</label>
                                 </div>
                              </div>
                              <div className="col-md">
                                 <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <div className="form-floating">
                                       <input type="number" className="form-control" id="amount" placeholder="Amount" />
                                       <label className="text-dark" htmlFor="amount">Monto</label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="mb-3 row g-2">
                           <div className="col-md">
                              <div className="form-floating">
                                 <input type="date" className="form-control" id="date" placeholder="Date" />
                                 <label className="text-dark" htmlFor="date">Fecha</label>
                              </div>
                           </div>
                           <div className="col-md">
                              <div className="form-floating">
                                 <select className="form-select" id="transactionAccountCard" defaultValue={'default'}>
                                 </select>
                                 <label className="text-dark" htmlFor="transactionAccountCard">Tipo</label>
                              </div>
                           </div>
                        </div>
                     </form>
                  </div>
                  <div className="modal-footer text-bg-dark">
                     <button id="addTransaction" type="button" className="btn btn-primary" onClick={addTransaction}>Ingresar transaccion</button>
                  </div>
               </div>
            </div>
         </div>
         <FormModal id="newBankAccountModal" title="Nuevo Banco" buttonId="addBankAccount" buttonHandle={addBankAccount} inputs={formNewBankAccountInputs} selects={formNewBankAccountSelects} />
         <FormModal id="newBankCardModal" title="Nueva Tarjeta" buttonId="addBankCard" buttonHandle={addBankCard} inputs={formNewBankCardInputs} selects={formNewBankCardSelects} />
         {fetchStatus && <MessageModal type={modalType} title={fetchStatus} body={modalBody} onClose={handleMessageModal} />}
         {fetchingData && <LoadModal />}
      </div>
   )
}

export default Home
