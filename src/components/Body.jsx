
import React from 'react'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'

import { Outlet } from 'react-router'
const Body = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <NavBar/>
       
        <Outlet/>
        <Footer/>
        

    </div>
   
  )
}

export default Body