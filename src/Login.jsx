import React from 'react'
import {useState} from 'react';
import axios from 'axios';
const Login = () => {

    const [emailId,setEmailId]=useState();
    const [password,setPassword]=useState();


    const handelLogin  =async()=>{

        try{
            await  axios.post("http://localhost:4000/auth/login", {
            emailId,
            password
        },{withCredentials:true});
        alert("user logged in successfully");
        }catch(err){
            console.log("error in logging in the user: " + err.message);
        }
      
    }
  return (

    <div className="flex justify-center items-center  bg-base-200">

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend text-center text-2xl font-bold">Login</legend>

            <label className="label">Email</label>
            <input type="email" 
            className="input" 
            placeholder="Email"
            value={emailId}
            onChange={(e)=>setEmailId(e.target.value)}
            />

            <label className="label">Password</label>
            <input
            type="password" 
            className="input" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />


            <button className="btn btn-neutral mt-4"
            onClick={handelLogin}
            >Login</button>
        </fieldset>
    </div>
    

    
  )
}

export default Login