import React from 'react'
import DataTable from 'react-data-table-component';
import moment from 'react-moment';
import 'moment-timezone';

const transactColumns = [
   {
      name: 'Crypto',
      selector: row => row.symbol,
      sortable: true
   },
   {
      name: 'Fiat',
      selector: row => row.fiat,
      sortable: true
   },
   {
      name: 'Local Fiat',
      selector: row => row.localFiat,
      sortable: true
   },
   {
      name: 'Crypto Buy Price',
      selector: row => row.cryptoPrice,
      sortable: true,
      format: row => '$ ' + row.cryptoPrice
   },
   {
      name: 'Cant. Crypto',
      selector: row => row.quantity,
      sortable: true
   },
   {
      name: '$ Fiat',
      selector: row => row.totalFiat,
      sortable: true,
      format: row => '$ ' + row.totalFiat
   },
   {
      name: '$ LocalFiat',
      selector: row => row.totalLocalFiat,
      sortable: true,
      format: row => '$ ' + row.totalLocalFiat
   },
   {
      name: 'Location',
      selector: row => row.location,
      sortable: true
   },
   {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
      format: row => (new Date(row.date)).toLocaleString()
   },
   {
      name: 'N° Order',
      selector: row => row.transactionID,
      sortable: true
   },
   {
      name: 'Type',
      selector: row => row.type,
      sortable: true
   }
]

const portfolioColumns = [
   {
      name: 'Crypto',
      selector: row => row.symbol,
      sortable: true
   },
   {
      name: 'Quantity',
      selector: row => row.quantity,
      sortable: true
   },
   {
      name: 'Total USD',
      selector: row => row.totalUSD,
      sortable: true,
      format: row => '$ ' + parseFloat(row.totalUSD).toFixed(3)
   },
   {
      name: 'AVG Buy Price',
      selector: row => row.avgPrice,
      sortable: true,
      format: row => '$ ' + row.avgPrice
   },
   {
      name: 'Profit / Lose',
      selector: row => row.profit,
      sortable: true,
      format: row => '$ ' + parseFloat(row.profit).toFixed(3)
   }
]

const Tables = (props) => {
   let totalFiatUsed = 0
   let totalLocalFiat = 0
   return(
      <div className="row mt-5">
         <div className="table-responsive-sm col-12 col-lg-7">
            <DataTable
               title="Transactions"
               columns={transactColumns}
               data={props.transactHist}
               pagination
               highlightOnHover
               theme="dark"
               defaultSortFieldId='9'
               defaultSortAsc={false}
            />
         </div>
         <div className="table-responsive-sm col-12 col-lg-5">
            <DataTable
               title="Portfolio"
               columns={portfolioColumns}
               data={props.portfolio}
               pagination
               highlightOnHover
               theme="dark"
               defaultSortFieldId='5'
               defaultSortAsc={false}
            />
         </div>
      </div>
   )
}

export default Tables