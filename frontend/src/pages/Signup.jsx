
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", {
        email,
        password,
      })

      if (response.data.success) {
        setOtpSent(true)
        setError("")
      } else {
        setError(response.data.message || "Signup failed. Try again.")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:8000/auth/verify-otp", {
        email,
        otp,
      })

      if (response.data.success) {
        console.log("OTP Verified. Redirecting...")
        setError("")
        navigate("/login")
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen pt-20 md:pt-16">
        <div className="w-full max-w-md p-6 md:p-8 mx-4 bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
          {!otpSent ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Create Account</h2>
                <p className="text-gray-400">Sign up to access PYQ Finder</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                  />
                </div>

                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-blue-400 hover:text-blue-300">
                  Log in
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Verify Email</h2>
                <p className="text-gray-400">Enter the OTP sent to your email</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-400 mb-1">
                    OTP Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                  />
                </div>

                <button
                  onClick={handleOtp}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-md text-sm">{error}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup

