import React, {useEffect} from 'react';
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

import {
    Outlet,
} from "react-router-dom";

const Dashboard = (props) => {

    return (
        <>
            <Navbar />
            <Sidebar appName={props.appName} />            
            <Outlet />
        </>
    )

}

export default Dashboard;
