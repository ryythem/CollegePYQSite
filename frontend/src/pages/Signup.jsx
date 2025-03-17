import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import Navbar from "../components/Navbar";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:8000/auth/signup", {
        email,
        password,
      });

      if (response.data.success) {
        setOtpSent(true);
        setError(""); 
      } else {
        setError(response.data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/auth/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        console.log("OTP Verified. Redirecting...");
        setError(""); 
        navigate('/login')
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed. Try again.");
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      {!otpSent ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignup}>Submit</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleOtp}>Verify OTP</button>
        </div>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default Signup;
