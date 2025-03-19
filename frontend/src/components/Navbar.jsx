

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
    navigate("/")
  }

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 fixed w-full top-0 z-40">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="text-xl font-semibold text-white tracking-tight">
          Last Moment <span className="text-blue-500">Kids</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {!token ? (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition duration-200 ease-in-out"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* Show Dashboard link only if not on the dashboard page */}
              {location.pathname !== "/dashboard" && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition duration-200 ease-in-out"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition duration-200 ease-in-out border border-gray-700"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-300 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-md flex flex-col items-center justify-center space-y-6 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 z-50" : "opacity-0 -z-10 pointer-events-none"
        }`}
      >
        <button className="absolute top-6 right-6 text-gray-300" onClick={() => setIsMenuOpen(false)}>
          <X size={24} />
        </button>

        {!token ? (
          <>
            <Link
              to="/login"
              className="text-lg text-gray-300 hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition duration-200 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            {/* Show Dashboard link only if not on the dashboard page */}
            {location.pathname !== "/dashboard" && (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition duration-200 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
              className="px-9 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition duration-200 ease-in-out border border-gray-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

