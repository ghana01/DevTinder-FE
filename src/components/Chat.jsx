import React from 'react'
import { useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { createSocketConnection } from '../utils/socketio';
import { useSelector } from 'react-redux';

const Chat = () => {
    // Get the targetUserId from URL (the person we're chatting with)
    const { targetUserId } = useParams();
    
    // Get logged-in user data from Redux store
    const userData = useSelector(store => store.user);
    const userId = userData ? userData._id : null;
    
    // State to store all chat messages (array of message objects)
    const [messages, setMessages] = useState([]);
    
    // State to store the current text being typed in input field
    const [newMessage, setNewMessage] = useState("");
    
    // useRef to store socket connection (persists across re-renders)
    // This prevents creating multiple socket connections
    const socketRef = useRef(null);
    
    // useEffect runs when component loads or when userId/targetUserId changes
    useEffect(() => {
        // Don't connect if user is not logged in
        if (!userId) return;
        
        // Step 1: Create socket connection to backend
        socketRef.current = createSocketConnection();
        const socket = socketRef.current;
        
        // Step 2: Join the chat room with the other user
        // This tells the backend "I want to chat with this person"
        socket.emit("join-chat", {
            firstName: userData.firstName,
            userId,
            targetUserId
        });
        console.log("Joined chat room with:", targetUserId);
        
        // Step 3: Listen for incoming messages from the backend
        // Whenever someone sends a message, this function runs
        socket.on('receive-message', ({ firstName, message, sender }) => {
            console.log("New message received from " + firstName + ": " + message);
            
            // Add the new message to our messages array
            setMessages((prevMessages) => [
                ...prevMessages, // Keep all old messages
                {
                    text: message,
                    sender: sender === userId ? 'me' : 'other', // Check if I sent it or they did
                    firstName: firstName,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        });
        
        // Step 4: Cleanup function - runs when component unmounts
        // Disconnect socket to avoid memory leaks
        return () => {
            socket.disconnect();
            console.log("Disconnected from chat");
        }
        
    }, [userId, targetUserId]); // Re-run if userId or targetUserId changes
    
    // Function to send a message when user clicks Send button
    const sendMessage = () => {
        // Don't send if message is empty
        if (!newMessage.trim()) return;
        
        // Use the existing socket connection (don't create a new one!)
        const socket = socketRef.current;
        
        // Send message to backend via socket
        socket.emit("send-message", {
            firstName: userData.firstName,
            from: userId,
            to: targetUserId,
            text: newMessage
        });
        
        console.log("Sent message:", newMessage);
        
        // Clear the input field after sending
        setNewMessage("");
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-base-200 p-4'>
            <div className='w-full max-w-4xl h-[85vh] bg-base-100 rounded-lg shadow-xl flex flex-col'>
                
                {/* Chat Header */}
                <div className='bg-primary text-primary-content p-4 rounded-t-lg flex items-center gap-3'>
                    <div className='avatar'>
                        <div className='w-12 h-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2'>
                            <img src='https://avatar.iran.liara.run/public' alt='User Avatar' />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <h2 className='font-bold text-lg'>User Name</h2>
                        <p className='text-xs opacity-80'>Online</p>
                    </div>
                    <button className='btn btn-ghost btn-sm btn-circle'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Chat Messages Container - Shows all messages */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-base-200'>
                    {/* If no messages yet, show a friendly message */}
                    {messages.length === 0 ? (
                        <div className='flex justify-center items-center h-full'>
                            <p className='text-gray-500'>No messages yet. Start the conversation! 👋</p>
                        </div>
                    ) : (
                        /* Loop through all messages and display them */
                        messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-2 max-w-[70%] ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className='avatar'>
                                    <div className='w-8 h-8 rounded-full'>
                                        <img 
                                            src={message.sender === 'me' 
                                                ? 'https://avatar.iran.liara.run/public/boy' 
                                                : 'https://avatar.iran.liara.run/public/girl'
                                            } 
                                            alt='avatar' 
                                        />
                                    </div>
                                </div>

                                {/* Message Bubble */}
                                <div>
                                    <div className={`px-4 py-2 rounded-2xl ${
                                        message.sender === 'me' 
                                            ? 'bg-primary text-primary-content rounded-br-none' 
                                            : 'bg-base-100 text-base-content rounded-bl-none'
                                    }`}>
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
                        {/* Emoji Button */}
                        <button className='btn btn-ghost btn-circle btn-sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        {/* Attachment Button */}
                        <button className='btn btn-ghost btn-circle btn-sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>

                        {/* Input Field - Type your message here */}
                        <input
                            type='text'
                            placeholder='Type your message here...'
                            className='input input-bordered flex-1'
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                // Send message when Enter key is pressed
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />

                        {/* Send Button */}
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