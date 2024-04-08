import React from 'react'
import '../assets/sidebars.css'

import {
   NavLink
} from 'react-router-dom'

const PATHS = [
   {
      path: '/',
      component: 'Inicio',
      icon: 'house-door'
   },
   // {
   //    path: '/cryptos',
   //    component: 'Cryptos',
   //    icon: 'currency-bitcoin'
   // },
   {
      path: '/transactions',
      component: 'Transacciones',
      icon: 'arrow-left-right'
   },
   {
      path: '/banks',
      component: 'Cuentas Bancarias',
      icon: 'bank'
   }
]

class Sidebar extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         activeLink: 'home',
         dataFetched: false
      }
   }

   render() {
      return (
         <div className="l-navbar" id="nav-bar">
            <nav className="nav">
               <div className="">
                  <div className="">
                     <a href="/" className="nav_logo ms-3">
                        <img src={require("../assets/img/react-icon.png")} alt="..." className="img-thumbnail rounded-circle m-0 p-0" style={{ width: "45px", height: "45px" }} />
                        <div className="row" style={{ maxWidth: "200px" }}>
                           <span className="nav_logo-name">{this.props.appName}</span>
                           <span id="user-role" className="nav_logo-name"></span>
                        </div>
                     </a>
                  </div>
                  <hr id="sidebar-hr" className="mx-3 border border-warning text-center opacity-100" />
                  <div className="nav_list">
                     {PATHS.map((path) => {
                        return (
                           <NavLink key={path.path} end to={path.path} className="nav_link text-white" aria-current="page">
                              <i className={"bi bi-" + path.icon + " me-2 nav_icon"}  />
                              {path.component}
                           </NavLink>
                        )
                     })}
                  </div>
               </div>
            </nav>
         </div>
      )
   }
}

export default Sidebar