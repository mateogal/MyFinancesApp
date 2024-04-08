import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import MaterialReactTable from 'material-react-table'

const defaultMaterialTheme = createTheme();
const darkTheme = createTheme({
   palette: {
      mode: 'dark',
   },
});

const Tables = (props) => {

   const TableTitle = () => {
      return <h5>{props.title}</h5>
   }

   return (
      <ThemeProvider theme={darkTheme}>
         <MaterialReactTable
            renderTopToolbarCustomActions={() => (
               <TableTitle />
            )}
            columns={props.columns}
            data={props.data}
            enableRowSelection={false}
            enableColumnOrdering
            enableGrouping
            initialState={{ showGlobalFilter: true }}
            localization={MRT_Localization_EN}
            muiTableHeadCellProps={{
               sx: {
                  '& .Mui-TableHeadCell-Content': {
                     justifyContent: 'center',
                  },
               },
            }}
            muiTableBodyCellProps={{
               sx: {
                  textAlign: "center"
               }
            }}
            muiTablePaperProps={{
               sx: {
                  border: "1px solid rgb(2, 158, 12)"
               }
            }}
         />
      </ThemeProvider>
   )
}

export default Tables