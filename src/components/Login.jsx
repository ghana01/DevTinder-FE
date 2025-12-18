import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.js'
import { useNavigate } from 'react-router' // Fixed: use react-router-dom
import axios from 'axios';

const Login = () => {
    const [emailId, setEmailId] = useState("ghandahsy23@gmail.com");
    const [password, setPassword] = useState("Password@123#");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false); // NEW: Track forgot password state
    const [resetToken, setResetToken] = useState(""); // NEW: For reset password flow
    const [newPassword, setNewPassword] = useState(""); // NEW: For new password
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // NEW: Success feedback
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            setError("");
            setSuccessMessage("");
            
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

    // NEW: Handle Forgot Password - Send Reset Email
    const handleForgotPassword = async () => {
        try {
            setError("");
            setSuccessMessage("");

            const res = await axios.post("http://localhost:4000/auth/forget-password", {
                emailId
            });

            setSuccessMessage(res.data);
        } catch (err) {
            setError(err?.response?.data || "Failed to send reset email");
        }
    }

    // NEW: Handle Reset Password with Token
    const handleResetPassword = async () => {
        try {
            setError("");
            setSuccessMessage("");

            if (!resetToken || !newPassword) {
                setError("Please enter both token and new password");
                return;
            }

            const res = await axios.post(`http://localhost:4000/auth/reset-password/${resetToken}`, {
                password: newPassword
            });

            setSuccessMessage(res.data + " You can now login.");
            
            // Reset to login form after 2 seconds
            setTimeout(() => {
                setIsForgotPassword(false);
                setIsLogin(true);
                setResetToken("");
                setNewPassword("");
                setSuccessMessage("");
            }, 2000);

        } catch (err) {
            setError(err?.response?.data || "Failed to reset password");
        }
    }

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setIsForgotPassword(false);
        setError("");
        setSuccessMessage("");
    }

    const showForgotPassword = () => {
        setIsForgotPassword(true);
        setIsLogin(false);
        setError("");
        setSuccessMessage("");
    }

    const backToLogin = () => {
        setIsForgotPassword(false);
        setIsLogin(true);
        setError("");
        setSuccessMessage("");
    }

    return (
        <div className="flex justify-center items-center my-10 bg-base-200">
            <div className="card bg-base-100 w-96 shadow-xl p-8">
                {/* TITLE */}
                <h2 className="text-3xl font-bold text-center mb-6">
                    {isForgotPassword ? "Reset Password" : (isLogin ? "Login" : "Signup")}
                </h2>

                {/* FORGOT PASSWORD FLOW */}
                {isForgotPassword ? (
                    <>
                        {!successMessage.includes("sent successfully") ? (
                            // Step 1: Enter Email to get reset link
                            <>
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full mb-4"
                                    placeholder="Enter your email"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                />

                                {successMessage && <p className="text-success text-sm mb-4">{successMessage}</p>}
                                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                                <button className="btn btn-primary w-full mb-2" onClick={handleForgotPassword}>
                                    Send Reset Link
                                </button>

                                <p className="text-center text-sm">
                                    Already have a reset token?{" "}
                                    <span 
                                        className="text-primary cursor-pointer hover:underline"
                                        onClick={() => setSuccessMessage("Enter token below")}
                                    >
                                        Enter it here
                                    </span>
                                </p>
                            </>
                        ) : (
                            // Step 2: Enter Token and New Password
                            <>
                                <label className="label">
                                    <span className="label-text">Reset Token</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full mb-2"
                                    placeholder="Paste token from email"
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                />

                                <label className="label">
                                    <span className="label-text">New Password</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full mb-4"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                {successMessage && <p className="text-success text-sm mb-4">{successMessage}</p>}
                                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                                <button className="btn btn-primary w-full" onClick={handleResetPassword}>
                                    Reset Password
                                </button>
                            </>
                        )}

                        <p className="py-4 text-center cursor-pointer hover:underline" onClick={backToLogin}>
                            Back to Login
                        </p>
                    </>
                ) : (
                    // LOGIN / SIGNUP FLOW
                    <>
                        {/* Show Name fields ONLY if it is Signup */}
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
                            className="input input-bordered w-full mb-2"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* NEW: Forgot Password Link (only show in Login mode) */}
                        {isLogin && (
                            <p 
                                className="text-sm text-right text-primary cursor-pointer hover:underline mb-4"
                                onClick={showForgotPassword}
                            >
                                Forgot Password?
                            </p>
                        )}

                        <p className="text-red-500 text-sm mb-4">{error}</p>

                        <button className="btn btn-primary w-full" onClick={handleAuth}>
                            {isLogin ? "Login" : "Sign Up"}
                        </button>

                        <p className="py-4 text-center cursor-pointer hover:underline" onClick={toggleForm}>
                            {isLogin ? "New to DevTinder? Sign Up" : "Already a member? Login"}
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login