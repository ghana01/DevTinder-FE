import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.js'
import { useNavigate } from 'react-router' // Best practice: use react-router-dom
import axios from 'axios';

const Login = () => {
    const [emailId, setEmailId] = useState("ghandahsy23@gmail.com");
    const [password, setPassword] = useState("Password@123#");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLogin, setIsLogin] = useState(true); // State to toggle forms
    const [error, setError] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            setError(""); // Clear previous errors
            
            if (isLogin) {
                // --- LOGIN LOGIC ---
                const res = await axios.post("http://localhost:4000/auth/login", {
                    emailId,
                    password
                }, { withCredentials: true });
                
                dispatch(addUser(res.data));
                navigate('/');
            } else {
                // --- SIGNUP LOGIC ---
                const res = await axios.post("http://localhost:4000/auth/signup", {
                    firstName,
                    lastName,
                    emailId,
                    password
                }, { withCredentials: true });
                
                dispatch(addUser(res.data));
                navigate('/');
            }

        } catch (err) {
            setError(err?.response?.data || "Something went wrong");
            console.log("Error: " + err.message);
        }
    }

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError(""); // Clear error when switching
    }

    return (
        <div className="flex justify-center items-center my-10 bg-base-200">
            <div className="card bg-base-100 w-96 shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-6">
                    {isLogin ? "Login" : "Signup"}
                </h2>

                {/* Show Name fields ONLY if it is NOT Login (i.e., Signup) */}
                {!isLogin && (
                    <>
                        <label className="label">
                            <span className="label-text">First Name</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full mb-2"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <label className="label">
                            <span className="label-text">Last Name</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full mb-2"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </>
                )}

                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input
                    type="email"
                    className="input input-bordered w-full mb-2"
                    placeholder="Email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                />

                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input
                    type="password"
                    className="input input-bordered w-full mb-4"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p className="text-red-500 text-sm mb-4">{error}</p>

                <button
                    className="btn btn-primary w-full"
                    onClick={handleAuth}
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                <p className="py-4 text-center cursor-pointer hover:underline" onClick={toggleForm}>
                    {isLogin ? "New to DevTinder? Sign Up" : "Already a member? Login"}
                </p>
            </div>
        </div>
    )
}

export default Login