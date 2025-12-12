import React from 'react'
import NavBar from './NavBar.jsx'
import Login from "./Login.jsx"
import Body from "./Body.jsx"
import Footer from './Footer.jsx'
import { BrowserRouter,Routes,Route } from 'react-router'
import './App.css'

function App() {
  

  return (
    <>
 
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Body/>} >
             <Route path='/login' element={<Login/>} />
             <Route path="/footer" element={<Footer/>} />

         </Route>
      </Routes>

    </BrowserRouter>
   
    
    </>
  )
}

export default App
 