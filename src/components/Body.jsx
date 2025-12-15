
import React,{useEffect} from 'react'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'
import {useDispatch,useSelector} from 'react-redux';
import axios from 'axios';
import {addUser,removeUser} from '../utils/userSlice.js'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router';
const Body = () => {

  const dispatch =useDispatch()
  const Navigate =useNavigate();
  const userData =useSelector(store =>store.user);
  const fetchUser = async () => {
     if(userData) return; 
    try{
        const res =await axios.get("http://localhost:4000/profile",{
      withCredentials:true
    });
    dispatch(addUser(res.data));
    }catch(err){
      // dispatch(removeUser()); // Ensure Redux is cleared if API fails
      if(err.status ===401){
           Navigate('/login')
      }
      console.error(err);
    }

  }
  useEffect(()=>{
    
       fetchUser();
    
  },[]);
  return (
    <div className="flex flex-col min-h-screen">
        <NavBar/>
       
        <Outlet/>
        <Footer/>
        

    </div>
   
  )
}

export default Body