"use client";

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
        "http://localhost:8000/files/my-uploads",
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
          "http://localhost:8000/files/upload",
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

        if (res.status === 200) {
          setFile(null);
          fetchFiles();
        }
      } catch (e) {
        setError("File upload failed. Please try again.");
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
        `http://localhost:8000/files/delete-file/${fileId}`,
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
    <div className="min-h-screen bg-[#111] text-gray-200">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-xl text-center font-semibold text-white mb-4">
              Upload File
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
                className="border-2 border-dashed border-gray-700 rounded-lg p-2 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                <div className="flex flex-col items-center">
                  <FaUpload className="text-gray-400 text-3xl mb-3" />
                  <p className="text-gray-300">
                    Click to upload or drag and drop
                  </p>
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

          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg flex items-center gap-2">
              <FaExclamationTriangle className="text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Files Uploaded by You:
            </h2>

            {files.length === 0 ? (
              <div className="text-center py-12">
                <FaFile className="text-gray-700 text-5xl mx-auto mb-4" />
                <p className="text-gray-500">No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file._id}
                    className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="bg-gray-700 p-2 rounded">
                        <FaFile className="text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-blue-400 font-medium truncate block transition-colors"
                        >
                          {file.filename}
                        </a>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
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
    </div>
  );
};

export default Dashboard;
