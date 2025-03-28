import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  FaUpload,
  FaTrash,
  FaExclamationTriangle,
  FaFile,
} from "react-icons/fa";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputFileRef = useRef();
  const token = localStorage.getItem("token");

  const uploadFile = () => {
    inputFileRef.current.click();
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/files/my-uploads`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(response.data.files);
    } catch (e) {
      setError("Failed to fetch files. Please try again.");
    }
  };

  useEffect(() => {
    if (!file) return;

    if (!file.name.endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size greater than 10 MB is not allowed.");
      setFile(null);
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    const upload = async () => {
      const data = new FormData();
      data.append("file", file);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/files/upload`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );

        if (res.data.success === false) {
          setError(res.data.message);
        }
        setFile(null);
        fetchFiles();
      } catch (e) {
        setError(
          e.response?.data?.message || "File upload failed. Please try again."
        );
      } finally {
        setUploading(false);
      }
    };
    upload();
  }, [file]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/files/delete-file/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchFiles();
      } else {
        setError("Error deleting the file. Please try again.");
      }
    } catch (e) {
      setError("Error deleting the file.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-16 md:py-20 flex flex-col flex-grow">
        <div className="max-w-5xl mx-auto w-full">
          {/* Upload File Section */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl text-center font-semibold text-white mb-3 sm:mb-4">
              Upload File{" "}
              <span className="text-sm sm:text-md block mt-1">
                (Format: Subject_Semester_ExamType_Dept_Year)
              </span>{" "}
              <span className="text-xs sm:text-sm block mt-1">
                (Eg: COA_Sem3_MidSem_BTech_2024.pdf)
              </span>
            </h2>

            {uploading ? (
              <div className="space-y-3">
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            ) : (
              <div
                onClick={uploadFile}
                className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                <div className="flex flex-col items-center">
                  <FaUpload className="text-gray-400 text-3xl mb-3" />
                  <p className="text-gray-300">Click to upload</p>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg flex items-center gap-2">
              <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Files List */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-white mb-4">
              Files Uploaded by You:
            </h2>

            {files.length === 0 ? (
              <div className="text-center py-12">
                <FaFile className="text-gray-700 text-5xl mx-auto mb-4" />
                <p className="text-gray-500">No files uploaded yet</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto min-h-20 max-h-[calc(100vh-300px)] space-y-3">
                {files.map((file) => (
                  <div
                    key={file._id}
                    className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden"
                  >
                    <div className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-thin">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 text-white hover:text-blue-400 font-medium py-3 transition-colors flex-grow"
                      >
                        {file.filename}
                      </a>
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="p-3 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        /* Thin scrollbar for Webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }

        /* For Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(75, 85, 99, 0.5) rgba(31, 41, 55, 0.5);
        }

        /* Enable momentum-based scrolling on iOS */
        .scrollbar-thin {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
