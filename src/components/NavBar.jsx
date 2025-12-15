import React from 'react'
import {useSelector} from 'react-redux';
import {Link} from 'react-router'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {removeUser} from "../utils/userSlice.js"
import {useNavigate} from 'react-router'; 
const NavBar = () => {
 const user =useSelector((store)=> store.user)
 console.log("user in navbar:",user);

 const dispatch =useDispatch();
 const Navigate =useNavigate();
 const handelLogout =async()=>{
     
  try{
  await axios.post("http://localhost:4000/auth/logout",{},{withCredentials:true});
    alert("user logged out successfully");
    dispatch(removeUser());
   
    Navigate('/login');


  }catch(err){
    //err logic and may be redireted to err page 
    console.log(err);
  }
 }

  return (
    <div>
        <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <Link to='/' className="btn btn-ghost text-xl">DEVTINDER </Link>
  </div>
  <div className="flex gap-2">
    <p className="px-4 text-white"> Welcome,{user && user.firstName}</p>
    <div className="dropdown dropdown-end">
      
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          {user && ( <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          )}
          
            
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to='/profile' className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
          
        </li>
        <li><a>Settings</a></li>
        <li><a onClick={handelLogout}>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
    </div>
  )
}

export default NavBar