import React from 'react'
import NavBar from './components/NavBar.jsx'
import Login from "./components/Login.jsx"
import Body from "./components/Body.jsx"
import Footer from './components/Footer.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import appStore from './utils/appStore.js'
import Feed from './components/Feed.jsx'



function App() {
  

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<Body/>} >
              <Route path='/feed' element={<Feed/>} />
              <Route path='/login' element={<Login/>} />
              <Route path="/footer" element={<Footer/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
 