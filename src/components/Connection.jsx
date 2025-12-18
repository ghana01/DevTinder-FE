import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection } from '../utils/connectionSlice';

const Connection = () => {
    const dispatch = useDispatch();
    const connections = useSelector(store => store.connection);
    
    const fetchConnections = async () => {
        try {
            // FIX: Check if connections exists (is not null)
            if (connections) return;
            
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/connection`, { withCredentials: true });
            console.log("connections data", res.data);
            dispatch(addConnection(res.data.connectionRequest));
        } catch (err) {
            console.log("error in fetching connections", err);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);

    // Handle loading state (null)
    if (!connections) return null;

    // Handle empty state (array length 0)
    if (connections.length === 0) {
        return (
            <div className='flex justify-center items-center my-10'>
                <h1 className='font-bold text-xl'>No Connections Found</h1>
            </div>
        )
    }

    return (
        <div className="text-center my-10">
            <h1 className='font-bold text-3xl mb-5'>Connections</h1>
            
            <div className='flex flex-col items-center gap-4'>
                {connections.map((connection) => {
                    const data = connection.fromUserId;

                    return (
                        <div key={connection._id} className="flex items-center bg-base-200 p-4 rounded-lg w-1/2 shadow-md">
                            <img 
                                src={data.photoUrl} 
                                alt="profile" 
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div className="text-left">
                                <p className="font-bold text-lg">{data.firstName} {data.lastName}</p>
                                {data.age && data.gender && (
                                    <p className="text-sm text-gray-500">{data.age} • {data.gender}</p>
                                )}
                                <p className="text-sm">{data.about}</p>
                                <p className='text-sm'>{data.skills}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
export default Connection