import React,{useState} from 'react'
import UserCard from"./UserCard.jsx"
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {addUser} from '../utils/userSlice.js'
const EditProfile = ({user}) => {
       const [firstName,setFirstName]=useState(user.firstName);
        const [lastName,setLastName]=useState(user.lastName);
        const [age,setAge]=useState(user.age);
        const [gender,setGender]=useState(user.gender);
        const [about,setAbout]=useState(user.about);
        const [photoUrl,setPhotoUrl]=useState(user.photoUrl);
        const [error,setError]=useState("");

        const dispatch =useDispatch();
        const saveProfile =async ()=>{
            // before saving the profile cler the error
            setError("");
            try{
                const res =await axios.patch("http://localhost:4000/profile/edit",{
                    firstName,
                    lastName,
                    age,    
                    gender,
                    about,
                    photoUrl
                },{withCredentials:true});
                dispatch(addUser(res?.data?.data));
                alert("profile updated successfully");
                console.log(res.data);
            }catch(err){
                console.log("error in saving profile",err);
                setError("error in saving profile"+ err.response.data);
            }
        }
  return (
    <div className='flex justify-center items-center flex-col md:flex-row gap-10 '>
    <div className="flex justify-center items-center  bg-base-200">

            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend text-center text-2xl font-bold">Edit Profile</legend>

                <label className="label">First Name</label>
                <input type="text" 
                className="input" 
                placeholder="First Name"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                />

                <label className="label">Last Name</label>
                <input
                type="text" 
                className="input" 
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
                    <label className="label">Age</label>
                    <input
                    type="text" 
                    className="input" 
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    />
                        <label className="label">Gender</label>
                    <input
                    type="text" 
                    className="input" 
                    placeholder="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    />
                    <label className="label">About</label>
                    <textarea
                    type="text" 
                    className="input"
                    placeholder="About"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    />
                    <label className="label">Photo URL</label>
                    <input
                    type="text" 
                    className="input"
                    placeholder="Photo URL"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    />


                <p className="text-red-500">{error}</p>
                <button className="btn btn-neutral mt-4"
                onClick={saveProfile}
                >Save Profile</button>
            </fieldset>
    </div>
    <UserCard user={{firstName,lastName,photoUrl,age,gender,about}}/>

    </div>
  )
}

export default EditProfile