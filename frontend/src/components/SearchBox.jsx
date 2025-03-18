import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaFile, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";

const SearchBox = () => {
  const [input, setInput] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);
  //debouncing
  useEffect(() => {
    fetchFiles(debouncedInput);
  }, [debouncedInput]);

  const fetchFiles = async (query) => {
    if (!query) {
      setPdfs([]);
      setNoResult(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await axios.get(
        `http://localhost:8000/files/search?query=${query}`
      );

      if (response.data.success) {
        setPdfs(response.data.files);
        setNoResult(response.data.files.length === 0);
      }
    } catch (e) {
      console.log("Error fetching files");
      setNoResult(true);
      setPdfs([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? (
            <FaSpinner className="text-gray-400 animate-spin" />
          ) : (
            <FaSearch className="text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Search for question papers..."
          className="w-full py-4 pl-12 pr-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
        />
      </div>

      {/* Search Results */}
      <div className="mt-4 w-full max-w-xl">
        {noResult && (
          <div className="text-center py-6 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-400">
              No question papers found for "{input}"
            </p>
          </div>
        )}

        {pdfs.length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">Search Results</h3>
            </div>
            <ul className="divide-y divide-gray-800 max-h-60 overflow-y-auto">
              {pdfs.map((pdf, index) => (
                <li
                  key={index}
                  className="hover:bg-gray-800/50 transition-colors"
                >
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
