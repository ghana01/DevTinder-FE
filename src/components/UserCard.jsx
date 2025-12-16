import React from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {

    const dispatch = useDispatch();
  console.log("user card rendered", user);

  // Safety check
  if (!user) return null;
  

  const { _id,firstName, lastName, photoUrl, age, gender, about } = user;
     const handelsendRequest = async (status,_id)=>{
        await axios.post(`http://localhost:4000/request/send/${status}/${_id}`,
            {},{withCredentials:true});

        alert(`Request ${status} successfully`);
        
        dispatch(removeFeed(_id));

     }
  return (
    <div className="card bg-blue-300 w-96 shadow-xl">
      <figure>
        <img
          src={photoUrl}
          alt="user photo"
          className="w-full h-60 object-cover object-top" 
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        
        <div className="card-actions justify-center my-4">
          <button
          onClick={() => handelsendRequest('ignore', _id)}
          className="btn btn-secondary">Ignore</button>
          <button onClick={() => handelsendRequest('interested', _id)} className="btn btn-primary">Interested</button>
        </div>
      </div>
    </div>
  )
}

export default UserCard