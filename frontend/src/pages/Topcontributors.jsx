import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { FaTrophy } from "react-icons/fa";

const TopContributors = () => {
  const [uploaders, setUploaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUploads = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/files/top-contributors`
        );
        if (response.data.success) {
          setUploaders(response.data.topContributors);
        }
      } catch (error) {
        console.error("Error fetching top contributors:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    getUploads();
  }, []);

  // Trophy colors for top 3 contributors
  const getTrophy = (index) => {
    const colors = ["text-yellow-400", "text-gray-400", "text-orange-500"];
    return index < 3 ? (
      <FaTrophy className={`inline-block ${colors[index]} text-xl`} />
    ) : null;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          🏆 Top Contributors
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : uploaders.length > 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <table className="w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700 text-lg">
                  <th className="border border-gray-600 px-4 py-3">Rank</th>
                  <th className="border border-gray-600 px-4 py-3">Name</th>
                  <th className="border border-gray-600 px-4 py-3">
                    Total Uploads
                  </th>
                </tr>
              </thead>
              <tbody>
                {uploaders.map((uploader, index) => (
                  <tr
                    key={uploader._id}
                    className={`border border-gray-700 text-lg ${
                      index < 3
                        ? "bg-gradient-to-r from-gray-800 to-gray-900"
                        : index % 2 === 0
                        ? "bg-gray-800"
                        : "bg-gray-900"
                    }`}
                  >
                    <td className="px-4 py-3 text-center font-bold">
                      {getTrophy(index)} {index + 1}
                    </td>
                    <td className="px-4 py-3 text-center">{uploader._id}</td>
                    <td className="px-4 py-3 text-center">
                      {uploader.uploadCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">No contributors yet.</p>
        )}
      </div>
    </div>
  );
};

export default TopContributors;
