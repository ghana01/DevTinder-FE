import React, { useEffect } from 'react'
import axios from 'axios'
import { addRequest } from '../utils/requestSlice.js'
import { useDispatch, useSelector } from 'react-redux';

const Request = () => {
    const dispatch = useDispatch();
    const requests = useSelector(store => store.request);

    const reviewRequest =async (status, _id) => {
        // TODO: WRITE YOUR LOGIC HERE
        // 1. Call API: POST /request/review/:status/:requestId
        // 2. Dispatch action to remove this request from Redux store
        try{
            const res =await axios.post(`http://localhost:4000/request/review/${status}/${_id}`,
                {},{withCredentials:true});
            console.log("review request response",res.data);
            //Update the redux 
            const updatedRequests = requests.filter(request => request._id !== _id);
            dispatch(addRequest(updatedRequests));
            alert(`Request ${status} successfully`);
        }catch(err){
                console.log("error in reviewing request",err);
        }
        console.log(`Reviewing request: ${_id} with status: ${status}`);
    }

    const getRequests = async () => {
        try {
            const res = await axios.get("http://localhost:4000/user/requests", { withCredentials: true });
            dispatch(addRequest(res.data.data));
        } catch (err) {
            console.log("error in fetching requests", err);
        }
    }

    useEffect(() => {
        getRequests();
    }, []);

    if (!requests) return null;

    if (requests.length === 0) {
        return <h1 className="flex justify-center my-10 text-xl font-bold">No Connection Requests</h1>
    }

    return (
        <div className="text-center my-10">
            <h1 className="font-bold text-3xl mb-5">Connection Requests</h1>

            <div className="flex flex-col items-center gap-4">
                {requests.map((request) => {
                    // The user details are inside 'fromUserId'
                    const { _id, fromUserId } = request;
                    const { firstName, lastName, photoUrl, age, gender, about } = fromUserId;

                    return (
                        <div key={_id} className="flex justify-between items-center bg-base-200 p-4 rounded-lg w-2/3 md:w-1/2 shadow-md">
                            {/* Left Side: User Info */}
                            <div className="flex items-center">
                                <img
                                    src={photoUrl}
                                    alt="profile"
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div className="text-left">
                                    <p className="font-bold text-lg">{firstName} {lastName}</p>
                                    {age && gender && <p className="text-sm text-gray-500">{age}, {gender}</p>}
                                    <p className="text-sm text-gray-600 truncate w-48">{about}</p>
                                </div>
                            </div>

                            {/* Right Side: Buttons */}
                            <div className="flex gap-2">
                                <button 
                                    className="btn btn-error btn-sm text-white"
                                    onClick={() => reviewRequest('rejected', _id)}
                                >
                                    Reject
                                </button>
                                <button 
                                    className="btn btn-success btn-sm text-white"
                                    onClick={() => reviewRequest('accepted', _id)}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default Request