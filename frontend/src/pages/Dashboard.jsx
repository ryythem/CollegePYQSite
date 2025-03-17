import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
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
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size greater than 10 mb not allowed");
      return;
    }
    if (file) {
      const upload = async () => {
        const data = new FormData();
        data.append("file", file);
        try {
          const res = await axios.post(
            "http://localhost:8000/files/upload",
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.status === 200) {
            console.log("File uploaded successfully");
            setFile(null); // Clear the selected file
            fetchFiles(); // Refresh file list
          }
        } catch (e) {
          console.log(e.message);
        }
      };
      upload();
    }
  }, [file]); // Runs when file is set

  useEffect(() => {
    fetchFiles(); // Initial file fetch
  }, []);

  const handleDelete = async (toDeleteFile) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/files/delete-file/${toDeleteFile}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        console.log("File successfully deleted");
        fetchFiles();
      } else {
        console.log("Error deleting the file");
      }
    } catch (e) {
      console.log("error deleting the file");
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <button onClick={uploadFile}>Upload</button>
        <input
          type="file"
          ref={inputFileRef}
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <div>Your uploaded files</div>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.filename}
            </a>
            <button onClick={() => handleDelete(file._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
