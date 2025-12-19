
import React,{useEffect} from 'react'
import axios from 'axios'
import {useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import {addFeed} from '../utils/feedSlice.js'
import UserCard from "./UserCard.jsx";
const Feed = () => {
  
  const feed =useSelector(store =>store.feed);
  const dispatch =useDispatch();
    const getFeed =async ()=>{
      if(feed) return;
      const res =await axios.get("http://localhost:4000/user/feed",{withCredentials:true});
      dispatch(addFeed(res.data.data));
      console.log("feed data",res.data);

    };
    useEffect(()=>{
      getFeed();

    },[])
  return (
    feed && (
      <div className="flex justify-center items-center my-10">
         <UserCard user={feed[0]}/>
      </div>
    ) 
  
  )
}

export default Feed