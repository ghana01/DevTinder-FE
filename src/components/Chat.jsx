import React from 'react'
import { useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { createSocketConnection } from '../utils/socketio';
import { useSelector } from 'react-redux';
import axios from 'axios';
const Chat = () => {
    const { targetUserId } = useParams();
    const userData = useSelector(store => store.user);
    const userId = userData ? userData._id : null;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef(null);
    
    // Only store target user's display info (name and photo)
    const [targetUser, setTargetUser] = useState(null);

    const fetchChatHistory = async ()=>{
        try{
            const response = await axios.get(`http://localhost:4000/chat/${targetUserId}`, {
                withCredentials: true
            });
            const chatData = response.data.chat;
            
            // Find and store the target user's display information
            const target = chatData.participants.find(p => p._id === targetUserId);
            setTargetUser(target);
            
            // Format messages with user data
            const formattedMessages = chatData.message.map(msg => {
                const isMe = msg.senderId === userId;
                const sender = chatData.participants.find(p => p._id === msg.senderId);
                
                return {
                    text: msg.text,
                    sender: isMe ? 'me' : 'other',
                    firstName: sender?.firstName || 'Unknown',
                    photoUrl: sender?.photoUrl || 'https://avatar.iran.liara.run/public',
                    timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                };
            });
            
            setMessages(formattedMessages);
        }catch(err){
            console.log("Error fetching chat history:", err);
        }
    }
    
    useEffect(() => {
    if (!userId) return;
    
    fetchChatHistory();
    
    socketRef.current = createSocketConnection();
    const socket = socketRef.current;
    
    socket.emit("join-chat", {
        firstName: userData.firstName,
        userId,
        targetUserId
    });
    console.log("Joined chat room with:", targetUserId);
    
    socket.on('receive-message', ({ firstName, message, sender, photoUrl }) => {
        console.log("New message received from " + firstName + ": " + message);
        
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                text: message,
                sender: sender === userId ? 'me' : 'other',
                firstName: firstName,
                // Use photoUrl from socket event OR fallback to targetUser OR default
                photoUrl: photoUrl || (sender === userId ? userData.photoUrl : targetUser?.photoUrl) || 'https://avatar.iran.liara.run/public',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    });
    
    return () => {
        socket.disconnect();
        console.log("Disconnected from chat");
    }
    
}, [userId, targetUserId]);
    
    const sendMessage = () => {
        if (!newMessage.trim()) return;
        
        const socket = socketRef.current;
        
        socket.emit("send-message", {
            firstName: userData.firstName,
            from: userId,
            to: targetUserId,
            text: newMessage
        });
        
        console.log("Sent message:", newMessage);
        setNewMessage("");
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-base-200 p-4'>
            <div className='w-full max-w-4xl h-[85vh] bg-base-100 rounded-lg shadow-xl flex flex-col'>
                
                {/* Chat Header - Uses targetUser state for display */}
                <div className='bg-primary text-primary-content p-4 rounded-t-lg flex items-center gap-3'>
                    <div className='avatar'>
                        <div className='w-12 h-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2'>
                            <img src={targetUser?.photoUrl || 'https://avatar.iran.liara.run/public'} alt='User Avatar' />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <h2 className='font-bold text-lg'>
                            {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Loading...'}
                        </h2>
                        <p className='text-xs opacity-80'>Online</p>
                    </div>
                    <button className='btn btn-ghost btn-sm btn-circle'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Chat Messages Container */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-base-200'>
                    {messages.length === 0 ? (
                        <div className='flex justify-center items-center h-full'>
                            <p className='text-gray-500'>No messages yet. Start the conversation! 👋</p>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-2 max-w-[70%] ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className='avatar'>
                                    <div className='w-8 h-8 rounded-full'>
                                        <img 
                                            src={message.photoUrl} 
                                            alt={message.firstName} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className={`px-4 py-2 rounded-2xl ${
                                        message.sender === 'me' 
                                            ? 'bg-primary text-primary-content rounded-br-none' 
                                            : 'bg-base-100 text-base-content rounded-bl-none'
                                    }`}>
                                        <p className='text-xs font-semibold opacity-70 mb-1'>{message.firstName}</p>
                                        <p>{message.text}</p>
                                    </div>
                                    <p className={`text-xs opacity-60 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>

                {/* Message Input Area */}
                <div className='bg-base-100 p-4 rounded-b-lg border-t border-base-300'>
                    <div className='flex gap-2 items-center'>
                        <button className='btn btn-ghost btn-circle btn-sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        <button className='btn btn-ghost btn-circle btn-sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>

                        <input
                            type='text'
                            placeholder='Type your message here...'
                            className='input input-bordered flex-1'
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />

                        <button className='btn btn-primary'
                            onClick={sendMessage}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Chat