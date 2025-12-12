
import React from 'react'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'
import Login from './Login.jsx'
import { Outlet } from 'react-router'
const Body = () => {
  return (
    <div>
        <NavBar/>
       
        <Outlet/>
        <Footer/>
        

    </div>
   
  )
}

export default Body