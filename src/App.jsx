import React from 'react'
import NavBar from './components/NavBar.jsx'
import Login from "./components/Login.jsx"
import Body from "./components/Body.jsx"
import Footer from './components/Footer.jsx'
import Profile from "./components/Profile.jsx"
import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import appStore from './utils/appStore.js'
import Feed from './components/Feed.jsx'
import Connection from './components/Connection.jsx'
import Request from './components/Request.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Chat from './components/Chat.jsx'
function App() {
  

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<Body/>} >
              <Route path='/' element={<Feed/>} />
              <Route path='/login' element={<Login/>} />
              <Route path="/footer" element={<Footer/>} />
              <Route path='/profile' element={<Profile/>} />
              <Route path='connection' element={<Connection/>} />
              <Route path='/request' element={<Request/>} />
              <Route path='/error' element ={<ErrorPage/>} />
              <Route path="/chat/:targetUserId" element ={<Chat/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
 