import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "../context/UserContext"

const Navbar = () => {
   const [userContext, setUserContext] = useContext(UserContext)
   const [navbarToggle, setNavbarToggle] = useState(false)

   const toggleSidebar = (toggle, nav, bodypd, headerpd) => {
      // change icon
      const toggleMenu = document.getElementById('header-toggle');
      //set X icon
      (navbarToggle) ? toggleMenu.classList.add('bi-x-square') : toggleMenu.classList.remove('bi-x-square');
      // show navbar
      (navbarToggle) ? nav.classList.add('show-sidebar') : nav.classList.remove('show-sidebar');
      // add padding to body
      (navbarToggle) ? bodypd.classList.add('body-pd') : bodypd.classList.remove('body-pd');
      // add padding to header
      (navbarToggle) ? headerpd.classList.add('body-pd') : headerpd.classList.remove('body-pd');
   }

   const showNavbar = (toggleId, navId, bodyId, headerId) => {
      const toggle = document.getElementById(toggleId),
         nav = document.getElementById(navId),
         bodypd = document.getElementById(bodyId),
         headerpd = document.getElementById(headerId)
      // Validate that all variables exist
      if (toggle && nav && bodypd && headerpd) {
         toggleSidebar(toggle, nav, bodypd, headerpd)
      }
   }

   useEffect(() => {
      document.body.id = "body-pd"
      showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

      /*===== LINK ACTIVE =====*/
      const linkColor = document.querySelectorAll('.nav_link')

      function colorLink() {
         if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
         }
      }
      linkColor.forEach(l => l.addEventListener('click', colorLink))
   }, [])

   useEffect(() => {
      showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')
   }, [navbarToggle])

   return (
      <>
         <header className="header bg-dark" id="header">
            <div className="row">
               <div className="col-6 header_toggle">
                  <i className='bi bi-list' id="header-toggle" onClick={() => setNavbarToggle(!navbarToggle)}></i>
               </div>
            </div>
            <div className="dropdown">
               <a href="#a" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="https://github.com/mateogal.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                  {userContext.details && <strong>{userContext.details.username}</strong>}
               </a>
               <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                  <li><a className="dropdown-item" href="#">Perfil</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/logout">Cerrar sesion</a></li>
               </ul>
            </div>
         </header>
      </>

   )
}

export default Navbar