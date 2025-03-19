

import axios from "axios"
import { useState, useEffect } from "react"
import { FaSearch, FaFile, FaExternalLinkAlt, FaSpinner } from "react-icons/fa"

const SearchBox = () => {
  const [input, setInput] = useState("")
  const [pdfs, setPdfs] = useState([])
  const [noResult, setNoResult] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [debouncedInput, setDebouncedInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input)
    }, 500)

    return () => clearTimeout(timer)
  }, [input])

  // Fetch PDFs on input change
  useEffect(() => {
    fetchFiles(debouncedInput)
  }, [debouncedInput])

  const fetchFiles = async (query) => {
    if (!query) {
      setPdfs([])
      setNoResult(false)
      return
    }

    setIsSearching(true)

    try {
      const response = await axios.get(`http://localhost:8000/files/search?query=${query}`)

      if (response.data.success) {
        setPdfs(response.data.files)
        setNoResult(response.data.files.length === 0)
      }
    } catch (e) {
      console.log("Error fetching files")
      setNoResult(true)
      setPdfs([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Search Box */}
      <div
        className={`relative w-full max-w-xl transition-all duration-300 ${
          isFocused ? "scale-105 shadow-lg" : ""
        }`}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? <FaSpinner className="text-gray-400 animate-spin" /> : <FaSearch className="text-gray-400" />}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delayed to allow clicking results
          placeholder="Search for question papers..."
          className="w-full py-3 md:py-4 pl-12 pr-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
        />
      </div>

      {/* Search Results Dropdown */}
      {isFocused && (noResult || pdfs.length > 0) && (
        <div className="absolute top-full mt-2 w-full max-w-xl bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden">
          {noResult && (
            <div className="text-center py-6">
              <p className="text-gray-400">No question papers found for "{input}"</p>
            </div>
          )}

          {pdfs.length > 0 && (
            <ul className="divide-y divide-gray-800 max-h-60 overflow-y-auto">
              {pdfs.map((pdf, index) => (
                <li key={index} className="hover:bg-gray-800/50 transition-colors">
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 text-gray-300 hover:text-white"
                  >
                    <div className="bg-gray-800 p-2 rounded mr-3">
                      <FaFile className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{pdf.filename}</p>
                    </div>
                    <FaExternalLinkAlt className="text-gray-500 ml-2" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBox
